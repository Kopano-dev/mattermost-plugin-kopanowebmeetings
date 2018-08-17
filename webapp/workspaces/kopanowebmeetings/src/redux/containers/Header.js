import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {getTheme} from 'mattermost-redux/selectors/entities/preferences';

import Header from 'components/Header';
import {actions, selectors} from 'redux/ducks';
const {
	isSidebarOpen,
	isFullScreenOpen,
	hasCallBeenStarted,
	getCallStartTime,
} = selectors;

const mapStateToProps = state => ({
	showTimer: hasCallBeenStarted(state['plugins-kopanowebmeetings']),
	startTime: getCallStartTime(state['plugins-kopanowebmeetings']),
	showFullScreenButton: !isFullScreenOpen(state['plugins-kopanowebmeetings']),
	showSidebarButton: !isSidebarOpen(state['plugins-kopanowebmeetings']),
	theme: getTheme(state),
});
const mapDispatchToProps = dispatch => bindActionCreators({
	...actions,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Header);
