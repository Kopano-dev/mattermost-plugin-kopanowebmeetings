import {connect} from 'react-redux';

import {getCurrentChannel} from 'mattermost-redux/selectors/entities/channels';
import {getStatusForUserId} from 'mattermost-redux/selectors/entities/users';

import {selectors} from 'redux/ducks';
const {kwmIsConnected, hasCallBeenStarted} = selectors;
import Constants from 'utils/constants';
const {UserStatuses} = Constants;
console.log('UserStatuses', UserStatuses);

import HeaderButton from 'components/HeaderButton';

const mapStateToProps = state => {
	const currentChannel = getCurrentChannel(state);
	const directTeammateId = currentChannel.teammate_id || '';
	const teammateStatus = directTeammateId ? getStatusForUserId(state, directTeammateId) : '';

	const connected = kwmIsConnected(state['plugins-kopanowebmeetings']);
	const callStarted = hasCallBeenStarted(state['plugins-kopanowebmeetings']);
	const disabled = (
		!connected ||
		(Boolean(directTeammateId) && (teammateStatus === UserStatuses.ONLINE || teammateStatus === UserStatuses.AWAY)) || //currently we only support one on one meetings
		callStarted
	);
	const active = callStarted;

	return {
		currentChannel,
		teammateStatus,
		disabled,
		active,
	};
};

export default connect(mapStateToProps, )(HeaderButton);
