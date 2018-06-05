import {connect} from 'react-redux';

import {getTheme} from 'mattermost-redux/selectors/entities/preferences';
import {makeStyleFromTheme} from 'mattermost-redux/utils/theme_utils';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';

import FullScreenContainer from 'components/FullScreenContainer';
import {Views} from 'utils/constants';
import {updateCaller} from 'actions/kwm_actions';

const getStylesFromTheme = makeStyleFromTheme( theme => ({
	fullscreencontainer: {
		background: theme.centerChannelBg,
		color: theme.centerChannelColor,
	},
}));

const mapStateToProps = (state, ownProps) => {
	const currentUserId = getCurrentUserId(state.mattermostReduxState);
	const focussedCaller = state.callers.find(caller => caller.focus);
	const isSelf = typeof focussedCaller === 'object' && currentUserId === focussedCaller.user.id;

	return {
		isOpen: state.view === Views.FULLSCREEN,
		theme: getTheme(state.mattermostReduxState),
		styles: getStylesFromTheme(getTheme(state.mattermostReduxState)),
		focussedCaller,
		self: isSelf,
	};
};
const mapDispatchToProps = (dispatch, props) => ({
	onVideoClick: caller => dispatch(updateCaller(caller.id, {focus: true})),
});

export default connect(mapStateToProps, mapDispatchToProps)(FullScreenContainer);