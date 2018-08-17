const AUTOREJECT_TIMEOUT = 6000; // 30 seconds

///////////////////////////////////
// Action types
///////////////////////////////////
const SHOW_CALL_NOTIFICATION = 'KWM/CALLNOTIFICATION/SHOW_CALL_NOTIFICATION';
const HIDE_CALL_NOTIFICATION = 'KWM/CALLNOTIFICATION/HIDE_CALL_NOTIFICATION';
const SET_AUTOREJECT_TIMER = 'KWM/CALLNOTIFICATION/SET_AUTOREJECT_TIMER';
const CANCEL_AUTOREJECT_TIMER = 'KWM/CALLNOTIFICATION/CANCEL_AUTOREJECT_TIMER';

///////////////////////////////////
// Actions
///////////////////////////////////
const actions = {
	openCallNotification: calledBy => ({
		type: SHOW_CALL_NOTIFICATION,
		calledBy,
	}),

	openCallNotificationWithTimeout: (caller, callback, key = 'autoRejectTimer') => (dispatch, getState) => {
		dispatch(actions.openCallNotification(caller));
		dispatch(actions.startAutoRejectTimer(caller, callback, key));
	},

	closeCallNotification: () => (dispatch, getState) => {
		dispatch(actions.cancelAutoRejectTimer());

		dispatch({
			type: HIDE_CALL_NOTIFICATION,
		});
	},

	// This action just closes the CallNotification after a certain time
	// Closing the call is left to the app by using a callback function
	startAutoRejectTimer: (caller, callback, key = 'autoRejectTimer') => (dispatch, getState) => {
		const timer = setTimeout(() => {
			if ( callback ) {
				callback(caller);
			}
			dispatch(actions.cancelAutoRejectTimer(key));
			dispatch(actions.closeCallNotification());
		}, AUTOREJECT_TIMEOUT);
		dispatch({
			type: SET_AUTOREJECT_TIMER,
			timer,
		});
	},

	cancelAutoRejectTimer: (key = 'autoRejectTimer') => (dispatch, getState) => {
		const autoRejectTimer = selectors.getAutoRejectTimer(getState()['plugins-kopanowebmeetings'], key);
		if ( autoRejectTimer ) {
			clearTimeout(autoRejectTimer);
		}

		dispatch({
			type: CANCEL_AUTOREJECT_TIMER,
		});
	},
};

///////////////////////////////////
// Reducers
///////////////////////////////////
const defaultState = {
	open: false,
	calledBy: null,
};
const reducers = {
	callNotification: (state = defaultState, action) => {
		switch (action.type) {
			case SHOW_CALL_NOTIFICATION:
				return {
					open: true,
					calledBy: action.calledBy,
				};
			case HIDE_CALL_NOTIFICATION:
				return {
					open: false,
					calledBy: null,
				};
			default:
				return state;
		}
	},

	autoRejectTimer: (state = null, action) => {
		switch (action.type) {
			case SET_AUTOREJECT_TIMER:
				return action.timer;
			case CANCEL_AUTOREJECT_TIMER:
				return null;
			default:
				return state;
		}
	},
};

///////////////////////////////////
// Selectors
///////////////////////////////////
const selectors = {
	isOpen: (state, key = 'callNotification') => state[key].open,
	getCaller: (state, key = 'callNotification') => state[key].calledBy,
	getAutoRejectTimer: (state, key = 'autoRejectTimer') => state[key],
};

///////////////////////////////////
// Exports
///////////////////////////////////
export {actions, reducers, selectors};

// The ducks specs say to export the reducers as default.
// Although we don't follow those specs completely, we will
// do this.
export default reducers;

