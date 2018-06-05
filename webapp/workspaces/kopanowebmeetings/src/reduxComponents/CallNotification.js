import {connect} from 'react-redux';

import CallNotification from '@kopanowebmeetings/shared-components/src/CallNotification';
import * as Utils from 'utils/utils.js';

const mapStateToProps = (state, ownProps) => {
	const {calledBy} = state.callNotification;
	return {
		open: state.callNotification.open,
		userName: calledBy ? Utils.getDisplayName(calledBy) : '',
		imgUrl: calledBy ? Utils.imageURLForUser(calledBy) : '',
		onAccept: () => ownProps.onAccept(calledBy),
		onReject: () => ownProps.onReject(calledBy),
	};
};

export default connect(mapStateToProps)(CallNotification);
