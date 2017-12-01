import {createStore, applyMiddleware, combineReducers} from 'redux'
import thunk from 'redux-thunk';

import * as mmRreducers from 'reducers/mattermost_redux.js';
import * as kwmReducers from 'reducers/kwm_reducers.js';

// Create our own redux store.
// TODO: Whenever Mattermost gives plugins the ability to add reducers
// to their store, we can remove our own store.
const kwmStore = createStore(
    combineReducers({
        ...mmRreducers,
        ...kwmReducers,
    }),
    {},
    applyMiddleware(thunk)
);

export default kwmStore;
