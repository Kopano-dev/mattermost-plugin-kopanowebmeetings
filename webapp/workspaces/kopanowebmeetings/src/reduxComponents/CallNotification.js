import {connect} from 'react-redux';

import CallNotification from '@kopanowebmeetings/shared-components/src/CallNotification';
import * as Utils from 'utils/utils.js';

const mapStateToProps = (state, props) => {
	const {calledBy} = state.callNotification;
	return {
		open: state.callNotification.open,
		userName: calledBy ? Utils.getDisplayName(state.callNotification.calledBy) : '',
		imgUrl: calledBy ? Utils.imageURLForUser(state.callNotification.calledBy) : '',
		onAccept: () => props.onAccept(state.callNotification.calledBy),
		onReject: () => props.onReject(state.callNotification.calledBy),
	};
};

export default connect(mapStateToProps)(CallNotification);
