import {connect} from 'react-redux';

import {getTheme} from 'mattermost-redux/selectors/entities/preferences';
import {makeStyleFromTheme} from 'mattermost-redux/utils/theme_utils';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';

import FullScreenContainer from 'components/FullScreenContainer';
import {actions, selectors} from 'redux/ducks';
const {updateCaller} = actions;
const {getCallers, isFullScreenOpen} = selectors;

const getStylesFromTheme = makeStyleFromTheme( theme => ({
	fullscreencontainer: {
		background: theme.centerChannelBg,
		color: theme.centerChannelColor,
	},
}));

const mapStateToProps = (state, ownProps) => {
	const currentUserId = getCurrentUserId(state);
	const focussedCaller = getCallers(state['plugins-kopanowebmeetings']).find(caller => caller.focus);
	const isSelf = typeof focussedCaller === 'object' && currentUserId === focussedCaller.user.id;
	const isOpen = isFullScreenOpen(state['plugins-kopanowebmeetings']);

	return {
		isOpen,
		theme: getTheme(state),
		styles: getStylesFromTheme(getTheme(state)),
		focussedCaller,
		self: isSelf,
	};
};
const mapDispatchToProps = (dispatch, props) => ({
	onVideoClick: caller => dispatch(updateCaller(caller.id, {focus: true})),
});

export default connect(mapStateToProps, mapDispatchToProps)(FullScreenContainer);
