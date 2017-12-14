import React from 'react';
import PropTypes from 'prop-types';
import {connect, Provider} from 'react-redux';

import Constants from 'utils/constants.js';
import kwmStore from 'store/kwm_store.js';
import KwmController from 'components/kwm_controller.jsx';

/**
 * The main purpose of this component is to be able to use full redux with reducers etc.
 * This component will set our own redux store as the provided store for its children.
 * The state of the Mattermost Redux store will be added to the state of our own store
 * in the property 'mattermostReduxState'.
 */
class KwmPlugin extends React.Component {
	constructor(props) {
		super(props);

		// HACK: We add the dispatch method of the Mattermost redux store
		// to our own store, so we can call it from our reducer to relay
		// actions.
		kwmStore.mmDispatch = this.props.dispatch;
	}

	render(props) {
		return (
			<Provider store={kwmStore}>
				<KwmController />
			</Provider>
		);
	}
}
KwmPlugin.propTypes = {
	dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
	// Propagate the changes in the Mattermost redux store to our own redux store
	kwmStore.dispatch({
		type: Constants.Actions.KWM_MMREDUX_STATE_CHANGE,
		state,
	});

	return {};
};

// Use the state of the redux store by connecting
export default connect(mapStateToProps)(KwmPlugin);
