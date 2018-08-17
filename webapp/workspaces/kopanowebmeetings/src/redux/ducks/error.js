///////////////////////////////////
// Action types
///////////////////////////////////
const ERROR = 'KWM/ERROR/ERROR';
const ERROR_HANDLED = 'KWM/ERROR/ERROR_HANDLED';

///////////////////////////////////
// Actions
///////////////////////////////////
const actions = {
	setError: error => ({
		type: ERROR,
		data: error,
	}),

	// TODO: errors should get an id so we can track multiple errors
	handleError: () => ({
		type: ERROR_HANDLED,
	}),
};

///////////////////////////////////
// Reducers
///////////////////////////////////
const defaultState = null;
const reducers = {
	error: (state = defaultState, action) => {
		switch (action.type) {
			case ERROR:
				return {
					code: -1,
					message: 'An error occurred',
					...action.data,
				};
			case ERROR_HANDLED:
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
	hasError: (state, key = 'error') => state[key] !== null,

	getError: (state, key = 'error') => {
		if ( selectors.hasError(state, key) ) {
			return state[key];
		}
		return null;
	},

	getErrorMessage: (state, key = 'error') => {
		if ( selectors.hasError(state, key) ) {
			return state[key].message;
		}
		return '';
	},

	getErrorCode: (state, key = 'error') => {
		if ( selectors.hasError(state, key) ) {
			return state[key].code;
		}
		return 0;
	},
};

///////////////////////////////////
// Exports
///////////////////////////////////
export {actions, reducers, selectors};

// The ducks specs say to export the reducers as default.
// Although we don't follow those specs completely, we will
// do this.
export default reducers;
