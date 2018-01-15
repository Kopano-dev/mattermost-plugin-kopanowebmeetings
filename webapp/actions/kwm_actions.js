import * as Selectors from 'mattermost-redux/selectors/entities/users';

import * as KWM from 'kopano-webmeetings/kwm.js';

import Constants from 'utils/constants.js';
const {Actions} = Constants;
import Client from 'client/client.js';
import {stopUserMedia} from 'utils/user_media.js';

export const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));

// Thunk
export const getConfig = () => async (dispatch, getState) => {
	dispatch({type: Actions.KWM_GET_CONFIG});

	const maxDelay = 20000;
	return new Promise(async (resolve, reject) => {
		const retryDelay = 500;
		let retryCount = 0;

		while (true) { // eslint-disable-line no-constant-condition
			try {
				console.info('fetching KWM config ...');
				const config = await Client.getConfig(); // eslint-disable-line no-await-in-loop
				dispatch(setConfig(config));
				resolve(config);
				return;
			} catch (e) {
				console.warn('failed to get KWM config - retrying');
				retryCount++;
				if (retryCount >= 100) {
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

// Thunk, because we need the state
export const createKwmObj = () => async (dispatch, getState) => {
	const {config} = getState().kwmState;

	if ( config === null || !config.kwmserver_url ) {
		return Promise.reject(new Error('No config available to create a KWM object'));
	}
	if ( !config.kwmserver_url || !config.token ) {
		return Promise.reject(new Error('No KWM server URL or token in KWM config'));
	}

	const options = {
		authorizationType: config.token.type,
		authorizationValue: config.token.value,
	};
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

	const kwm = new KWM(config.kwmserver_url, options);
	kwm.webrtc.config = {
		iceServers,
	};

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
		/* eslint-enable no-nested-ternary */
		setConnectionStatus(status);
	};

	kwm.onerror = event => {
		console.error('kwm error', event);
//		setKwmError(event);
	};

	// Add the listener for events triggered by the remote user
	kwm.webrtc.onpeer = event => {
		switch (event.event) {
			case 'incomingcall': {
				console.log('incoming call', event);
				const calledById = event.record.user;
				dispatch(openCallNotification(Selectors.getUser(getState().mattermostReduxState, calledById)));
				break;
			}
			case 'newcall':
				console.log('newcall');
				break;
			case 'destroycall':
				console.log('destroycall');
				dispatch(destroyCall());
				break;
			case 'abortcall': {
				console.log('abortcall', event);
				let message = 'Call aborted';
				if ( event.details === 'reject_busy' ) {
					message = 'The user you are calling is aleady in another call.';
				}
				dispatch(setError({
					message,
				}));
				dispatch(removeAllCallers());
				dispatch(stopLocalStream());
				dispatch(closeCallNotification());
				dispatch(closeKwmSidebar());
				kwm.webrtc.doHangup();
				break;
			}
			case 'pc.error':
				console.log('pc.error');
				break;
			default:
				console.log('unknown peer event: ', event.event, event);
		}
	};

	// Add a listener for streams
	kwm.webrtc.onstream = event => {
		const callerId = event.record.user;
		dispatch(updateCaller(callerId, {
			stream: event.stream,
		}));
	};

	return Promise.resolve(kwm);
};

// Thunk that will connect to the KWM server.
export const connectToKwmServer = () => async (dispatch, getState) => {
	const {kwm} = getState().kwmState;
	const userId = Selectors.getCurrentUser(getState().mattermostReduxState).id;

	dispatch(setConnectionStatus(Constants.KWM_CONN_STATUS_CONNECTING));

	// connect
	return kwm.connect(userId).then(() => {
		console.log('connected to KWM', kwm);
		dispatch(setConnectionStatus(Constants.KWM_CONN_STATUS_CONNECTED));
		return true;
	}).catch(err => {
		console.error('connect to KWM failed', err);
		dispatch(setConnectionStatus(Constants.KWM_CONN_NOT_CONNECTED));
		// TODO: handle error
		return err;
	});
};

export const destroyCall = () => (dispatch, getState) => {
	const {kwm} = getState().kwmState;
	kwm.webrtc.doHangup();

	dispatch(removeAllCallers());
	dispatch(stopLocalStream());
	dispatch(closeCallNotification());
	dispatch(closeKwmSidebar());
};

export const openKwmSidebar = () => ({
	type: Actions.KWM_OPEN_SIDEBAR,
});

export const closeKwmSidebar = () => ({
	type: Actions.KWM_CLOSE_SIDEBAR,
});

export const openCallNotification = calledBy => ({
	type: Actions.KWM_SHOW_CALL_NOTIFICATION,
	calledBy,
});

export const closeCallNotification = () => ({
	type: Actions.KWM_HIDE_CALL_NOTIFICATION,
});

export const addCaller = caller => ({
	type: Actions.KWM_ADD_CALLER,
	data: {
		...caller,
	},
});

export const updateCaller = (userId, data) => ({
	type: Actions.KWM_UPDATE_CALLER,
	userId,
	data,
});

export const removeCaller = userId => ({
	type: Actions.KWM_REMOVE_CALLER,
	userId,
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
