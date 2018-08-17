///////////////////////////////////
// Action types
///////////////////////////////////
const ADD_CALLER = 'KWM/CALLERS/ADD_CALLER';
const UPDATE_CALLER = 'KWM/CALLERS/UPDATE_CALLER';
const REMOVE_CALLER = 'KWM/CALLERS/REMOVE_CALLER';
const REMOVE_ALL_CALLERS = 'KWM/CALLERS/REMOVE_ALL_CALLERS';

///////////////////////////////////
// Actions
///////////////////////////////////
const actions = {
	addCaller: caller => ({
		type: ADD_CALLER,
		data: {
			...caller,
		},
	}),

	updateCaller: (id, data) => ({
		type: UPDATE_CALLER,
		id,
		data,
	}),

	removeCaller: id => ({
		type: REMOVE_CALLER,
		id,
	}),

	removeAllCallers: () => ({
		type: REMOVE_ALL_CALLERS,
	}),
};

///////////////////////////////////
// Reducers
///////////////////////////////////
const defaultState = [];
const reducers = {
	callers: (state = defaultState, action) => {
		let newState;
		switch (action.type) {
			case ADD_CALLER:
				newState = [...state];
				if ( !newState.some(caller => caller.user.id === action.data.user.id) ) {
					newState.push({
						stream: null,
						initiator: false,
						self: false,
						focus: false,
						...action.data,
					});
				}
				return newState;
			case UPDATE_CALLER: {
				newState = [...state];
				if ( action.data.focus ) {
					// Simply remove focus from all users first
					newState = newState.map((caller, index) => {
						const newCaller = {...caller};
						newCaller.focus = false;
						return newCaller;
					});
				}
				const callerIndex = newState.findIndex(caller => caller.user.id === action.id);
				if ( callerIndex > -1 ) {
					newState[callerIndex] = {
						...newState[callerIndex],
						...action.data,
					};
				}
				return newState;
			}
			case REMOVE_CALLER:
				return state.filter(caller => caller.user.id !== action.id);
			case REMOVE_ALL_CALLERS:
				return [];
			default:
				return state;
		}
	},
};

///////////////////////////////////
// Selectors
///////////////////////////////////
const selectors = {
	getCallers: (state, key = 'callers') => state[key],
	getOwnCallerProfile: (state, key = 'callers') => state[key].filter(c => c.self)[0],
	getOwnStream: (state, key = 'callers') => selectors.getOwnCallerProfile(state, key).stream,
};

///////////////////////////////////
// Exports
///////////////////////////////////
export {actions, reducers, selectors};

// The ducks specs say to export the reducers as default.
// Although we don't follow those specs completely, we will
// do this.
export default reducers;
