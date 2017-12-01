import Constants from 'utils/constants.js';
console.log('imported Constants', Constants, Constants.KWM_CONN_STATUS_CONNECTING)
const {Actions} = Constants;
import {fetchKwmAdminToken} from 'utils/utils.js';


export const setConnectionStatus = status => ({
    type: Actions.KWM_CONN_STATUS_CHANGE,
    status
});

export const setKwmError = error => ({
    type: Actions.KWM_ERROR,
    data: { error }
});

// TODO: errors should get an id so we can track multiple errors
export const handleKwmError = () => ({
    type: Actions.KWM_ERROR_HANDLED
});

/**
 * Thunk that will connect to the KWM server.
 * @param  {KWM} kwm Instance of the KWM class that is used to connect to the server.
 * @param  {String} userId The id of the connecting user
 * @return {Boolean|Object} True if the connection succeeded. Error object otherwise.
 */
export const connect = (kwm, userId) => async (dispatch, getState) => {
    let options = {};
    dispatch(setConnectionStatus(Constants.KWM_CONN_STATUS_CONNECTING));

    try {
        // Fetch an admin token
        // TODO: Get the uri of the api from the settings
        const token = await fetchKwmAdminToken('https://ronald:8843');
        console.log('token=', token)
        kwm.connectionOptions.authorizationType = token.type;
		kwm.connectionOptions.authorizationValue = token.value;
    } catch (err) {
        console.log('error fetching admin token', err)
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

export const openKwmSidebar = () => ({
    type: Actions.KWM_OPEN_SIDEBAR
});

export const closeKwmSidebar = () => ({
    type: Actions.KWM_CLOSE_SIDEBAR
});

export const openCallNotification = calledBy => ({
    type: Actions.KWM_SHOW_CALL_NOTIFICATION,
    calledBy
});

export const closeCallNotification = () => ({
    type: Actions.KWM_HIDE_CALL_NOTIFICATION
});

export const addCaller = caller => ({
    type: Actions.KWM_ADD_CALLER,
    data: {
        ...caller
    }
});

export const updateCaller = (userId, data)  => ({
    type: Actions.KWM_UPDATE_CALLER,
    userId,
    data
});

export const removeCaller = userId => ({
    type: Actions.KWM_REMOVE_CALLER,
    userId
});

export const removeAllCallers = () => ({
    type: Actions.KWM_REMOVE_ALL_CALLERS
});
