import * as Selectors from 'mattermost-redux/selectors/entities/users';

import * as KWM from 'kopano-webmeetings/kwm.js';

import Constants from 'utils/constants.js';
const {Actions} = Constants;
import {fetchKwmAdminToken} from 'utils/utils.js';
import Client from 'client/client.js';
import {stopUserMedia} from 'utils/user_media.js';

// Thunk
export const getConfig = () => async (dispatch, getState) => {
	dispatch({type: Actions.KWM_GET_CONFIG});
	let config = null;
	try {
		config = await Client.getConfig();
	} catch (err) {
		//TODO: Handle error
		console.error('Actions.getConfig. caught error', err);
		return null;
	}

	dispatch(setConfig(config));

	return config;
};

export const setConfig = config => ({
	type: Actions.KWM_SET_CONFIG,
	config,
});

// Thunk, because we need the state
export const createKwmObj = () => (dispatch, getState) => {
	const {config} = getState().kwmState;
	if ( config === null || !config.kwmserver_url ) {
		console.error('No config available to create a KWM object');
		return null;
	}

	const options = {};
	const kwm = new KWM(config.kwmserver_url, options);
	// Store a reference to the options in the kwm object
	kwm.connectionOptions = options;
	kwm.webrtc.config = {
		iceServers: [
			{
				url: config.stun_uri || 'stun:stun.l.google.com:19302',
			},
		],
	};

	dispatch({
		type: Actions.KWM_OBJ_CREATED,
		kwm,
	});

	return kwm;
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
export const addKwmListeners = () => (dispatch, getState) => {
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
};

/**
 * Thunk that will connect to the KWM server.
 * @param  {KWM} kwm Instance of the KWM class that is used to connect to the server.
 * @param  {String} userId The id of the connecting user
 * @return {Boolean|Object} True if the connection succeeded. Error object otherwise.
 */
export const connectToKwmServer = () => async (dispatch, getState) => {
	const {kwm, config} = getState().kwmState;
	const userId = Selectors.getCurrentUser(getState().mattermostReduxState).id;

	if ( config === null || !config.kwmserver_url ) {
		console.error('No config available to create a KWM object');
		return null;
	}

	dispatch(setConnectionStatus(Constants.KWM_CONN_STATUS_CONNECTING));

	try {
		// Fetch an admin token
		// TODO: Get the uri of the api from the settings
		const token = await fetchKwmAdminToken(config.kwmserver_url);
		kwm.connectionOptions.authorizationType = token.type;
		kwm.connectionOptions.authorizationValue = token.value;
	} catch (err) {
		console.error('error fetching admin token', err);
		dispatch(setConnectionStatus(Constants.KWM_CONN_STATUS_NOT_CONNECTED));
		return err;
	}

	// connect
	kwm.connect(userId).then(() => {
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
