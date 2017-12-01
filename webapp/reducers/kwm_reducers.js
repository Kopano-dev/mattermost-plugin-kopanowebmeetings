import Constants from 'utils/constants.js';
const {Actions} = Constants;

/**
 * The reducer for the state of the plugin errors
 * @param  {Object} [state={open: false}]   The previous state of the errors
 * @param  {Object} action                  The dispatched action
 * @return {Object}                         The new state of the errors
 */
export const error = (state=null, action) => {
    switch (action.type) {
        case Actions.KWM_ERROR:
            return action.data.error;
        case Actions.KWM_ERROR_HANDLED:
            return null;
        default:
            return state;
    }
};

/**
 * The reducer for the state of the connection with the KWM server
 * @param  {Object} [state={open: false}]   The previous state of the connection
 * @param  {Object} action                  The dispatched action
 * @return {Object}                         The new state of the connection
 */
export const kwmState = (state={connected: Constants.KWM_CONN_STATUS_NOT_CONNECTED}, action) => {
    switch (action.type) {
        case Actions.KWM_CONN_STATUS_CHANGE:
            return {
                connected: action.status
            };
        default:
            return state;
    }
}

/**
 * The reducer for the state of the KWM sidebar
 * @param  {Object} [state={open: false}]   The previous state of the sidebar
 * @param  {Object} action                  The dispatched action
 * @return {Object}                         The new state of the sidebar
 */
export const kwmSidebar = (state={open: false}, action) => {
    switch (action.type) {
        case Actions.KWM_OPEN_SIDEBAR:
            return {
                ...state,
                open: true
            };
        case Actions.KWM_CLOSE_SIDEBAR:
            return {
                ...state,
                open: false
            };
        default:
            return state;
    }
};

/**
 * The reducer for the state of the callNotification.
 * @param  {Object} [state={open: false]    The previous state of the call notification
 * @param  {Object} calledBy                The user profile of the caller
 * @param  {Object} action                  The dispatched action
 * @return {Object}                         The new state of the call notification
 */
export const callNotification = (state={open: false, calledBy:null}, action) => {
    switch (action.type) {
        case Actions.KWM_SHOW_CALL_NOTIFICATION:
            return {
                open: true,
                calledBy: action.calledBy
            };
        case Actions.KWM_HIDE_CALL_NOTIFICATION:
            return {
                open: false,
                calledBy: null
            };
        default:
            return state;
    }
};

/**
 * The callers reducer will add and remove every user that is in the current call
 * to the state including the current user.
 * @param  {Array}  [callers=[]] The previous state
 * @param  {Object} action       The action that was dispatched to the store
 * @return {Object}              The new state
 */
export const callers = (callers=[], action) => {
    switch (action.type) {
        case Actions.KWM_ADD_CALLER:
            // immutable function
            callers = [...callers];
            if ( !callers.some(caller => caller.user.id === action.data.user.id) ){
                callers.push({
                    stream: null,
                    initiator: false,
                    ...action.data
                });
            }
            return callers;
        case Actions.KWM_UPDATE_CALLER:
            // immutable function
            callers = [...callers];
            const callerIndex = callers.findIndex(caller => caller.user.id===action.userId);
            if ( callerIndex > -1 ){
                callers[callerIndex] = {
                    ...callers[callerIndex],
                    ...action.data
                }
            }
            return callers;
        case Actions.KWM_REMOVE_CALLER:
            callers = callers.filter(caller => caller.user.id!==action.userId);
            return callers;
        case Actions.KWM_REMOVE_ALL_CALLERS:
            return [];
        default:
            return callers;
    }
};
