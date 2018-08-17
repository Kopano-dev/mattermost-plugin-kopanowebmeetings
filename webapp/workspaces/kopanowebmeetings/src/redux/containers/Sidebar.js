import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {getTheme} from 'mattermost-redux/selectors/entities/preferences';

import SideBar from 'components/Sidebar';
import {actions, selectors} from 'redux/ducks';
const {closeSidebar} = actions;
const {isSidebarOpen} = selectors;

const mapStateToProps = state => ({
	isOpen: isSidebarOpen(state['plugins-kopanowebmeetings']),
	theme: getTheme(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
	closeSidebar,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
