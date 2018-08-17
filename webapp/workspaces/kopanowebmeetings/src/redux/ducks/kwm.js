///////////////////////////////////
// Constants
///////////////////////////////////
const NOT_CONNECTED = 'KWM/KWM/NOT_CONNECTED';
const CONNECTING = 'KWM/KWM/CONNECTING';
const CONNECTED = 'KWM/KWM/CONNECTED';
const RECONNECTING = 'KWM/KWM/STATUS_RECONNECTING';

///////////////////////////////////
// Action types
///////////////////////////////////
const STATUS_CHANGE = 'KWM/KWM/STATUS_CHANGE';
const ADD_LISTENERS = 'KWM/KWM/ADD_LISTENERS';

///////////////////////////////////
// Actions
///////////////////////////////////
const actions = {
	kwmSetStatus: status => ({
		type: STATUS_CHANGE,
		status,
	}),

	kwmSetNotConnected: () => actions.kwmSetStatus(NOT_CONNECTED),
	kwmSetConnecting: () => actions.kwmSetStatus(CONNECTING),
	kwmSetReconnecting: () => actions.kwmSetStatus(RECONNECTING),
	kwmSetConnected: () => actions.kwmSetStatus(CONNECTED),
};

///////////////////////////////////
// Reducers
///////////////////////////////////
const defaultState = {
	status: NOT_CONNECTED,
	listenersAdded: false,
};
const reducers = {
	kwm: (state = defaultState,	action) => {
		switch (action.type) {
			case STATUS_CHANGE:
				return {
					...state,
					status: action.status,
				};
			case ADD_LISTENERS:
				return {
					...state,
					listenersAdded: true,
				};
			default:
				return state;
		}
	},
};

///////////////////////////////////
// Selectors
///////////////////////////////////
const selectors = {
	kwmGetStatus: (state, key = 'kwm') => state[key].status,
	kwmIsConnecting: (state, key = 'kwm') => state[key].status === CONNECTING,
	kwmIsConnected: (state, key = 'kwm') => state[key].status === CONNECTED,
	kwmIsReconnecting: (state, key = 'kwm') => state[key].status === RECONNECTING,
	kwmListenersHaveBeenAdded: (state, key = 'kwm') => state[key].listenersAdded,
};

///////////////////////////////////
// Exports
///////////////////////////////////
export {actions, reducers, selectors};

// The ducks specs say to export the reducers as default.
// Although we don't follow those specs completely, we will
// do this.
export default reducers;

