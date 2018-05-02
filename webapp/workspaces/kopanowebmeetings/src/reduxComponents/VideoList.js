import {connect} from 'react-redux';

import * as Selectors from 'mattermost-redux/selectors/entities/users';

import {getDisplayName} from 'utils/utils.js';

// Original component
import VideoList from '@kopanowebmeetings/shared-components/src/VideoList';

const mapStateToProps = state => ({
	callers: state.callers.map(c => ({
		id: c.user.id,
		displayName: getDisplayName(c.user),
		stream: c.stream,
		focus: Boolean(c.focus),
	})),
	currentUserId: Selectors.getCurrentUserId(state.mattermostReduxState),
});

export default connect(mapStateToProps)(VideoList);
