import Constants from 'utils/constants.js';
const {Actions} = Constants;

/**
 * The reducer for the state of the plugin errors
 * @param  {Object} [state={open: false}]   The previous state of the errors
 * @param  {Object} action				  The dispatched action
 * @return {Object}						 The new state of the errors
 */
export const error = (state = null, action) => {
	switch (action.type) {
		case Actions.KWM_ERROR:
			return action.error;
		case Actions.KWM_ERROR_HANDLED:
			return null;
		default:
			return state;
	}
};

/**
 * The reducer for the state of the connection with the KWM server
 * @param  {Object} [state={open: false}]   The previous state of the connection
 * @param  {Object} action				  The dispatched action
 * @return {Object}						 The new state of the connection
 */
export const kwmState = (
	state = {
		fetchingConfig: false,
		config: null,
		connected: Constants.KWM_CONN_STATUS_NOT_CONNECTED,
		kwm: null,
		listenersAdded: false,
	},
	action
) => {
	switch (action.type) {
		case Actions.KWM_GET_CONFIG:
			return {
				...state,
				fetchingConfig: true,
			};
		case Actions.KWM_SET_CONFIG:
			return {
				...state,
				fetchingConfig: false,
				config: action.config,
			};
		case Actions.KWM_CONN_STATUS_CHANGE:
			return {
				...state,
				connected: action.status,
			};
		case Actions.KWM_OBJ_CREATED:
			return {
				...state,
				kwm: action.kwm,
			};
		case Actions.KWM_ADD_LISTENERS:
			return {
				...state,
				listenersAdded: true,
			};
		default:
			return state;
	}
};

export const localStream = (stream = null, action) => {
	switch (action.type) {
		case Actions.KWM_ADD_LOCAL_STREAM:
			return action.stream;
		case Actions.KWM_REMOVE_LOCAL_STREAM:
			return null;
		default:
			return stream;
	}
};

/**
 * The reducer for the state of the KWM sidebar
 * @param  {Object} [state={open: false}]   The previous state of the sidebar
 * @param  {Object} action				  The dispatched action
 * @return {Object}						 The new state of the sidebar
 */
export const kwmSidebar = (state = {open: false}, action) => {
	switch (action.type) {
		case Actions.KWM_OPEN_SIDEBAR:
			return {
				...state,
				open: true,
			};
		case Actions.KWM_CLOSE_SIDEBAR:
			return {
				...state,
				open: false,
			};
		default:
			return state;
	}
};

/**
 * The reducer for the state of the callNotification.
 * @param  {Object} [state={open: false]	The previous state of the call notification
 * @param  {Object} calledBy				The user profile of the caller
 * @param  {Object} action					The dispatched action
 * @return {Object}							The new state of the call notification
 */
export const callNotification = (state = {open: false, calledBy: null}, action) => {
	switch (action.type) {
		case Actions.KWM_SHOW_CALL_NOTIFICATION:
			return {
				open: true,
				calledBy: action.calledBy,
			};
		case Actions.KWM_HIDE_CALL_NOTIFICATION:
			return {
				open: false,
				calledBy: null,
			};
		default:
			return state;
	}
};

/**
 * The callers reducer will add and remove every user that is in the current call
 * to the state including the current user.
 * @param  {Array}  [state=[]] 	The previous state
 * @param  {Object} action	   	The action that was dispatched to the store
 * @return {Object}			  	The new state
 */
export const callers = (state = [], action) => {
	// immutable function
	const newState = [...state];
	switch (action.type) {
		case Actions.KWM_ADD_CALLER:
			if ( !newState.some(caller => caller.user.id === action.data.user.id) ) {
				newState.push({
					stream: null,
					initiator: false,
					...action.data,
				});
			}
			return newState;
		case Actions.KWM_UPDATE_CALLER: {
			const callerIndex = newState.findIndex(caller => caller.user.id === action.userId);
			if ( callerIndex > -1 ) {
				newState[callerIndex] = {
					...newState[callerIndex],
					...action.data,
				};
			}
			return newState;
		}
		case Actions.KWM_REMOVE_CALLER:
			return newState.filter(caller => caller.user.id !== action.userId);
		case Actions.KWM_REMOVE_ALL_CALLERS:
			return [];
		default:
			return newState;
	}
};

export const callStatus = (state = {started: false, startTime: 0, duration: 0}, action) => {
	switch (action.type) {
		case Actions.KWM_START_CALL_TIMER:
			return {
				...state,
				started: true,
				startTime: new Date().getTime(),
			};
		case Actions.KWM_STOP_CALL_TIMER:
			return {
				...state,
				started: false,
			};
		default:
			return state;
	}
};
