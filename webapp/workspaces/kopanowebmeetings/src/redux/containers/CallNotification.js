import {connect} from 'react-redux';

import CallNotification from '@kopanowebmeetings/shared-components/src/CallNotification';
import {selectors} from 'redux/ducks';
import * as Utils from 'utils/utils.js';

const {isOpen, getCaller} = selectors;

const mapStateToProps = (state, ownProps) => {
	const calledBy = getCaller(state['plugins-kopanowebmeetings']);
	return {
		open: isOpen(state['plugins-kopanowebmeetings']),
		userName: calledBy ? Utils.getDisplayName(calledBy) : '',
		imgUrl: calledBy ? Utils.imageURLForUser(calledBy) : '',
		onAccept: () => ownProps.onAccept(calledBy),
		onReject: () => ownProps.onReject(calledBy),
	};
};

export default connect(mapStateToProps)(CallNotification);
