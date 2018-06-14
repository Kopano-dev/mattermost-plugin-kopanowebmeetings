import * as Selectors from 'mattermost-redux/selectors/entities/users';

import * as KWM from 'kwmjs';

import Constants from 'utils/constants.js';
const {Actions} = Constants;
import Client from 'client/client.js';
import {stopUserMedia} from 'utils/user_media.js';
import {getDisplayName} from 'utils/utils.js';

export const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));

// Thunk
export const getConfig = () => (dispatch, getState) => {
	dispatch({type: Actions.KWM_GET_CONFIG});

	return new Promise(async (resolve, reject) => {
		const maxDelay = 20000;
		const maxRetryCount = 100;
		const retryDelay = 500;
		let retryCount = 0;

		while (true) { // eslint-disable-line no-constant-condition
			try {
				const config = await Client.getConfig(); // eslint-disable-line no-await-in-loop
				dispatch(setConfig(config));
				resolve(config);
				return;
			} catch (e) {
				console.warn('failed to get KWM config - retrying');
				retryCount++;
				if (retryCount >= maxRetryCount) {
					reject(new Error('failed to get KWM config: ' + e));
					return;
				}
			}

			let t = retryCount * retryDelay;
			if (t > maxDelay) {
				t = maxDelay;
			}
			await delay(t); // eslint-disable-line no-await-in-loop
		}
	});
};

export const setConfig = config => ({
	type: Actions.KWM_SET_CONFIG,
	config,
});

export const updateKwmWebRTCConfig = () => async (dispatch, getState) => {
	const {kwm, config} = getState().kwmState;

	if ( config === null || !config.kwmserver_url ) {
		throw new Error('No config available to update KWM WebRTC config');
	}

	// Build ICE servers from values in config.
	const iceServers = [
	];
	if (config.stun_uri) {
		iceServers.push({
			urls: config.stun_uri.split(' '),
		});
	}
	if (config.turn_uri) {
		const s = {
			urls: config.turn_uri.split(' '),
		};
		if (config.turn_username) {
			s.username = config.turn_username;
		}
		if (config.turn_password) {
			s.credential = config.turn_password;
		}
		iceServers.push(s);
	}

	// Update KWM WebRTC config.
	kwm.webrtc.config.iceServers = iceServers;

	dispatch({
		type: Actions.KWM_WEBRTC_CONFIG_UPDATED,
		config: kwm.webrtc.config,
	});

	return kwm.webrtc.config;
};

// Thunk, because we need the state
export const createKwmObj = () => async (dispatch, getState) => {
	const {config} = getState().kwmState;

	if ( config === null ) {
		return Promise.reject(new Error('No config available to create a KWM object'));
	}
	if ( !config.kwmserver_url || !config.token ) {
		return Promise.reject(new Error('No KWM server URL or token in KWM config'));
	}

	const options = {
		authorizationType: config.token.type,
		authorizationValue: config.token.value,
	};
	const kwm = new KWM(config.kwmserver_url, options);
	kwm.webrtc.config = {}; // Remove all potential defaults.

	dispatch({
		type: Actions.KWM_OBJ_CREATED,
		kwm,
	});

	return Promise.resolve(kwm);
};

export const setConnectionStatus = status => ({
	type: Actions.KWM_CONN_STATUS_CHANGE,
	status,
});

export const setError = error => ({
	type: Actions.KWM_ERROR,
	error,
});

// TODO: errors should get an id so we can track multiple errors
export const handleError = () => ({
	type: Actions.KWM_ERROR_HANDLED,
});

// Thunk, because we need the state
export const addKwmListeners = () => async (dispatch, getState) => {
	const {kwm} = getState().kwmState;

	kwm.onstatechanged = event => {
		/* eslint-disable no-nested-ternary, multiline-ternary, no-undefined */
		const status =
			event.connecting ? Constants.KWM_CONN_STATUS_CONNECTING : (
				event.connected ? Constants.KWM_CONN_STATUS_CONNECTED : (
					event.reconnecting ? Constants.KWM_CONN_STATUS_RECONNECTING : undefined
				));
		/* eslint-enable no-nested-ternary, multiline-ternary, no-undefined */
		setConnectionStatus(status);
	};

	kwm.onerror = event => {
		console.error('kwm error', event);
		//setKwmError(event);
	};

	// Add the listener for events triggered by the remote user
	kwm.webrtc.onpeer = event => { //eslint-disable-line complexity
		switch (event.event) {
			case 'incomingcall': {
				const calledById = event.record.user;
				dispatch(openCallNotificationWithTimeout(Selectors.getUser(getState().mattermostReduxState, calledById)));
				break;
			}
			case 'outgoingcall':
				// Call was accepted by peer
				break;
			case 'newcall':
				// Call was accepted by local user
				break;
			case 'destroycall':
				dispatch(destroyCall());
				break;
			case 'abortcall': {
				let message = 'Call aborted';
				if ( event.details === 'reject_busy' ) {
					message = 'The user you are calling is already in another call.';
				}
				dispatch(setError({
					message,
				}));
				dispatch(stopCallTimer());
				dispatch(removeAllCallers());
				dispatch(stopLocalStream());
				dispatch(closeCallNotification());
				dispatch(closeKwmSidebar());
				kwm.webrtc.doHangup();
				break;
			}
			case 'hangup': {
				let message = null;
				const user = Selectors.getUser(getState().mattermostReduxState, event.record.user);
				if ( event.details ) {
					switch (event.details.reason) {
						case 'autoreject':
							message = getDisplayName(user) + ' didn\'t pick up';
							break;
						case 'reject':
							message = getDisplayName(user) + ' rejected your call';
							break;
					}
				}
				if ( message ) {
					dispatch(setError({
						message,
					}));
				}
				break;
			}
			case 'pc.error':
				break;
			default:
				// Unknown peer event
		}
	};

	// Add a listener for streams
	kwm.webrtc.onstream = event => {
		dispatch(startCallTimer());
		const callerId = event.record.user;
		dispatch(updateCaller(callerId, {
			stream: event.stream,
		}));
	};

	return Promise.resolve(kwm);
};

// Thunk that will connect to the KWM server.
export const connectToKwmServer = () => (dispatch, getState) => {
	const {kwm} = getState().kwmState;
	const userId = Selectors.getCurrentUser(getState().mattermostReduxState).id;

	dispatch(setConnectionStatus(Constants.KWM_CONN_STATUS_CONNECTING));

	// connect
	return kwm.connect(userId).then(() => {
		dispatch(setConnectionStatus(Constants.KWM_CONN_STATUS_CONNECTED));
		return true;
	}).catch(err => {
		console.error('connect to KWM failed', err);
		dispatch(setConnectionStatus(Constants.KWM_CONN_NOT_CONNECTED));

		throw new Error('failed to connect to KWM: ' + err);
	});
};

export const destroyCall = () => (dispatch, getState) => {
	const {kwm} = getState().kwmState;
	kwm.webrtc.doHangup();

	dispatch(stopCallTimer());
	dispatch(removeAllCallers());
	dispatch(stopLocalStream());
	dispatch(closeCallNotification());
	dispatch(closeKwmSidebar());
};

export const startAutoRejectTimer = caller => (dispatch, getState) => {
	const {kwm} = getState().kwmState;
	const timer = setTimeout(() => {
		kwm.webrtc.doHangup(caller.id, 'autoreject');
		cancelAutoRejectTimer(dispatch, getState);
	}, Constants.KWM_AUTOREJECT_TIMEOUT);
	dispatch({
		type: Actions.KWM_SET_AUTOREJECT_TIMER,
		timer,
	});
};

export const cancelAutoRejectTimer = () => (dispatch, getState) => {
	const {autoRejectTimer} = getState();
	if ( autoRejectTimer ) {
		clearTimeout(autoRejectTimer);
	}

	dispatch({
		type: Actions.KWM_CANCEL_AUTOREJECT_TIMER,
	});
};

export const startCallTimer = () => ({
	type: Actions.KWM_START_CALL_TIMER,
});

export const stopCallTimer = () => ({
	type: Actions.KWM_STOP_CALL_TIMER,
});

export const openKwmSidebar = () => ({
	type: Actions.KWM_OPEN_SIDEBAR,
});

export const closeKwmSidebar = () => ({
	type: Actions.KWM_CLOSE_SIDEBAR,
});

export const openFullScreen = () => ({
	type: Actions.KWM_OPEN_FULLSCREEN,
});

export const openCallNotificationWithTimeout = (caller, time) => (dispatch, getState) => {
	dispatch(openCallNotification(caller));
	dispatch(startAutoRejectTimer(caller));
};

export const openCallNotification = calledBy => ({
	type: Actions.KWM_SHOW_CALL_NOTIFICATION,
	calledBy,
});

export const closeCallNotification = () => (dispatch, getState) => {
	const {callNotification} = getState();
	if ( !callNotification.open ) {
		return;
	}
	dispatch(cancelAutoRejectTimer());

	dispatch({
		type: Actions.KWM_HIDE_CALL_NOTIFICATION,
	});
};

export const addCaller = caller => ({
	type: Actions.KWM_ADD_CALLER,
	data: {
		...caller,
	},
});

export const updateCaller = (id, data) => ({
	type: Actions.KWM_UPDATE_CALLER,
	id,
	data,
});

export const removeCaller = id => ({
	type: Actions.KWM_REMOVE_CALLER,
	id,
});

export const removeAllCallers = () => ({
	type: Actions.KWM_REMOVE_ALL_CALLERS,
});

export const addLocalStream = stream => ({
	type: Actions.KWM_ADD_LOCAL_STREAM,
	stream,
});

export const stopLocalStream = () => (dispatch, getState) => {
	const {localStream} = getState();
	if ( !localStream ) {
		return;
	}

	// Stop the stream
	stopUserMedia(localStream);

	// Update the state
	dispatch({
		type: Actions.KWM_REMOVE_LOCAL_STREAM,
	});
};
