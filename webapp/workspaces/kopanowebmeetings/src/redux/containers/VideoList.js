import {connect} from 'react-redux';

import * as Selectors from 'mattermost-redux/selectors/entities/users';

import {selectors} from 'redux/ducks';
const {getCallers} = selectors;
import {getDisplayName} from 'utils/utils.js';

// Original component
import VideoList from '@kopanowebmeetings/shared-components/src/VideoList';

const mapStateToProps = state => ({
	callers: getCallers(state['plugins-kopanowebmeetings']).map(c => ({
		id: c.user.id,
		displayName: getDisplayName(c.user),
		stream: c.stream,
		focus: Boolean(c.focus),
	})),
	currentUserId: Selectors.getCurrentUserId(state),
});

export default connect(mapStateToProps)(VideoList);
