import Constants from 'utils/constants.js';
import kwmStore from 'store/kwm_store.js';

/**
 * This reducer updates the state of the KWM redux store with the changes
 * of the Mattermost redux store.
 * TODO: Once Mattermost has implemented a way for plugins to add their own
 * reducers to their redux store we can remove our own redux store.
 *
 * @param  {Object} [state={}] The state of our redux store.
 * @param  {Object} action     The action that was dispatched
 * @return {Object}            The updated state
 */
export const mattermostReduxState = (state = {}, action) => {
    switch (action.type) {
        case Constants.Actions.KWM_MMREDUX_STATE_CHANGE:
            return {
                ...state,
                ...action.state
            };
        case Constants.Actions.KWM_RELAY_ACTION:
            kwmStore.mmDispatch(action.action);
            return state;
        default:
            return state;
    }
};
