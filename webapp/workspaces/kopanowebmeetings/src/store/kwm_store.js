import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import thunk from 'redux-thunk';

import * as mmRreducers from 'reducers/mattermost_redux.js';
import * as kwmReducers from 'reducers/kwm_reducers.js';

// Enable use of redux dev tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line no-underscore-dangle

// Create our own redux store.
// TODO: Whenever Mattermost gives plugins the ability to add reducers
// to their store, we can remove our own store.
const kwmStore = createStore(
	combineReducers({
		...mmRreducers,
		...kwmReducers,
	}),
	{},
	composeEnhancers(applyMiddleware(thunk)),
);

export default kwmStore;
