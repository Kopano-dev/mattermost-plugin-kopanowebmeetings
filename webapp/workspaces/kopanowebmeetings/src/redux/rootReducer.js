
import {combineReducers} from 'redux';

import {reducers as duckReducers} from './ducks';

export default combineReducers({
	...duckReducers,
});
