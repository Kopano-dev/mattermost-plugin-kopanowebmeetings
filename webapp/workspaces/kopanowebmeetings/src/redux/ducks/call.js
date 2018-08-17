///////////////////////////////////
// Action types
///////////////////////////////////
const START_CALL_TIMER = 'KWM/CALL/START_CALL_TIMER';
const STOP_CALL_TIMER = 'KWM/CALL/STOP_CALL_TIMER';

///////////////////////////////////
// Actions
///////////////////////////////////
const actions = {
	startCallTimer: () => ({
		type: START_CALL_TIMER,
	}),

	stopCallTimer: () => ({
		type: STOP_CALL_TIMER,
	}),
};

///////////////////////////////////
// Reducers
///////////////////////////////////
const defaultState = {
	started: false,
	startTime: 0,
};
const reducers = {
	call: (state = defaultState, action) => {
		switch (action.type) {
			case START_CALL_TIMER:
				return {
					...state,
					started: true,
					startTime: new Date().getTime(),
				};
			case STOP_CALL_TIMER:
				return {
					...state,
					started: false,
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
	getCallStartTime: (state, key = 'call') => state[key].startTime,
	hasCallBeenStarted: (state, key = 'call') => state[key].started,
};

///////////////////////////////////
// Exports
///////////////////////////////////
export {actions, reducers, selectors};

// The ducks specs say to export the reducers as default.
// Although we don't follow those specs completely, we will
// do this.
export default reducers;
