import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as Selectors from 'mattermost-redux/selectors/entities/users';
import * as channelSelectors from 'mattermost-redux/selectors/entities/channels';

import {actions, selectors} from 'redux/ducks';
const {getOwnStream} = selectors;
import {getDirectTeammate} from 'utils/utils.js';

import RootContainer from 'components/RootContainer';

const mapStateToProps = state => ({
	currentUser: Selectors.getCurrentUser(state),
	getStatusForUserId: id => Selectors.getStatusForUserId(state, id),
	directTeammate: getDirectTeammate(state),
	getOwnStreamFromState: () => getOwnStream(state['plugins-kopanowebmeetings']),
	currentChannel: channelSelectors.getCurrentChannel(state),
});

const mapDispatchToProps = dispatch => {
	return {
		...bindActionCreators({
			...actions,
		}, dispatch),
	};
};

// Use the state of the redux store by connecting
export default connect(mapStateToProps, mapDispatchToProps)(RootContainer);
