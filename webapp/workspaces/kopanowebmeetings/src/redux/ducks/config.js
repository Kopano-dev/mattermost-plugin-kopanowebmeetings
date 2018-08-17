///////////////////////////////////
// Action types
///////////////////////////////////
const FETCHING_CONFIG = 'KWM/CONFIG/FETCHING_CONFIG';
const SET_CONFIG = 'KWM/CONFIG/SET_CONFIG';

///////////////////////////////////
// Actions
///////////////////////////////////
const actions = {
	setConfig: config => ({
		type: SET_CONFIG,
		data: config,
	}),
};

///////////////////////////////////
// Reducers
///////////////////////////////////
const defaultState = {
	fetching: false,
	data: null,
};
const reducers = {
	config: (state = defaultState, action) => {
		switch (action.type) {
			case FETCHING_CONFIG:
				return {
					...state,
					fetching: true,
				};
			case SET_CONFIG:
				return {
					...state,
					fetching: false,
					data: action.data,
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
	isBeingFetched: (state, key = 'config') => state[key].fetching,
	getConfiguration: (state, key = 'config') => state[key].data,
};

///////////////////////////////////
// Exports
///////////////////////////////////
export {actions, reducers, selectors};

// The ducks specs say to export the reducers as default.
// Although we don't follow those specs completely, we will
// do this.
export default reducers;
