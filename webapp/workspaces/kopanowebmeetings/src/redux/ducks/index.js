import {
	actions as errorActions,
	reducers as errorReducers,
	selectors as errorSelectors,
} from './error';
import {
	actions as callNotificationActions,
	reducers as callNotificationReducers,
	selectors as callNotificationSelectors,
} from './callNotification';
import {
	actions as configActions,
	reducers as configReducers,
	selectors as configSelectors,
} from './config';
import {
	actions as kwmActions,
	reducers as kwmReducers,
	selectors as kwmSelectors,
} from './kwm';
import {
	actions as callersActions,
	reducers as callersReducers,
	selectors as callersSelectors,
} from './callers';
import {
	actions as viewActions,
	reducers as viewReducers,
	selectors as viewSelectors,
} from './view';
import {
	actions as callActions,
	reducers as callReducers,
	selectors as callSelectors,
} from './call';

export const actions = {
	...errorActions,
	...callNotificationActions,
	...kwmActions,
	...configActions,
	...callersActions,
	...viewActions,
	...callActions,
};
export const reducers = {
	...errorReducers,
	...callNotificationReducers,
	...kwmReducers,
	...configReducers,
	...callersReducers,
	...viewReducers,
	...callReducers,
};
export const selectors = {
	...errorSelectors,
	...callNotificationSelectors,
	...kwmSelectors,
	...configSelectors,
	...callersSelectors,
	...viewSelectors,
	...callSelectors,
};
