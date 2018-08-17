///////////////////////////////////
// Constants
///////////////////////////////////
const VIEW_NONE = 'VIEW_NONE';
const VIEW_SIDEBAR = 'VIEW_SIDEBAR';
const VIEW_FULLSCREEN = 'VIEW_FULLSCREEN';

///////////////////////////////////
// Action types
///////////////////////////////////
const OPEN_SIDEBAR = 'KWM/VIEW/OPEN_SIDEBAR';
const CLOSE_SIDEBAR = 'KWM/VIEW/CLOSE_SIDEBAR';
const OPEN_FULLSCREEN = 'KWM/VIEW/OPEN_FULLSCREEN';

///////////////////////////////////
// Actions
///////////////////////////////////
const actions = {
	openSidebar: () => ({
		type: OPEN_SIDEBAR,
	}),

	closeSidebar: () => ({
		type: CLOSE_SIDEBAR,
	}),

	openFullScreen: () => ({
		type: OPEN_FULLSCREEN,
	}),
};

///////////////////////////////////
// Reducers
///////////////////////////////////
const defaultState = VIEW_NONE;
const reducers = {
	view: (state = defaultState, action) => {
		switch (action.type) {
			case OPEN_SIDEBAR:
				return VIEW_SIDEBAR;
			case CLOSE_SIDEBAR:
				return VIEW_NONE;
			case OPEN_FULLSCREEN:
				return VIEW_FULLSCREEN;
			default:
				return state;
		}
	},
};

///////////////////////////////////
// Selectors
///////////////////////////////////
const selectors = {
	isSidebarOpen: (state, key = 'view') => state[key] === VIEW_SIDEBAR,
	isFullScreenOpen: (state, key = 'view') => state[key] === VIEW_FULLSCREEN,
	isDefaultView: (state, key = 'view') => state[key] === VIEW_NONE,
};

///////////////////////////////////
// Exports
///////////////////////////////////
export {actions, reducers, selectors};

// The ducks specs say to export the reducers as default.
// Although we don't follow those specs completely, we will
// do this.
export default reducers;
