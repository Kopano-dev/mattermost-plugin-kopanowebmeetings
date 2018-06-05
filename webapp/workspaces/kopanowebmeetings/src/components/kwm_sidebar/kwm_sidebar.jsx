import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import rgba from 'rgba-convert';

import {getTheme} from 'mattermost-redux/selectors/entities/preferences';
import {makeStyleFromTheme} from 'mattermost-redux/utils/theme_utils';

import './kwm_sidebar.css';

import {Views} from 'utils/constants';
import {closeKwmSidebar} from 'actions/kwm_actions.js';
import KwmHeader from 'components/kwm_header/kwm_header.jsx';
import ActiveCallButtons from 'components/ActiveCallButtons';
import KwmVideoList from 'reduxComponents/VideoList.js';
import {removeClassFromElement, addClassToElement} from 'utils/utils.js';

const propTypes = {
	theme: PropTypes.object.isRequired,
	isOpen: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	onHangUp: PropTypes.func.isRequired,
};

class KwmSidebar extends React.PureComponent {
	render() {
		const {isOpen} = this.props;

		// TODO(Ronald): We shouldn't depend on classes defined by Mattermost, because the plugin
		// will break whenever they change/remove those
		if ( !isOpen ) {
			removeClassFromElement('.app__body .inner-wrap', ['webrtc--show', 'move--left', 'move--right']);
			removeClassFromElement('.app__body .webrtc', 'webrtc--show');
			return <div />;
		}

		removeClassFromElement('.app__body .inner-wrap', 'move--right');
		addClassToElement('.app__body .inner-wrap', ['webrtc--show', 'move--left']);
		removeClassFromElement('.app__body .sidebar--left', 'move--right');
		removeClassFromElement('.multi-teams .team-sidebar', 'move--right');
		addClassToElement('.app__body .webrtc', 'webrtc--show');

		const style = getStyle(this.props.theme);

		return (
			<div className='k-sidebar-webrtc' id='k-sidebar-webrtc' style={style.sidebar}>
				<KwmHeader title={this.props.title} />
				<KwmVideoList />
				<ActiveCallButtons onHangUp={this.props.onHangUp} />
			</div>
		);
	}
}
KwmSidebar.propTypes = propTypes;

const getStyle = makeStyleFromTheme( theme => {
	// Mattermost uses color opacity for the borders, so
	// let's just do the same.
	const c = rgba.obj(theme.centerChannelColor);
	c.a = 0.2 * 255; // eslint-disable-line no-magic-numbers
	return {
		sidebar: {
			background: theme.centerChannelBg,
			color: theme.centerChannelColor,
			borderColor: rgba.css(c),
		},
	};
});

const mapStateToProps = state => ({
	isOpen: state.view === Views.SIDEBAR,
	remoteUsers: state.remoteUsers || [],
	theme: getTheme(state.mattermostReduxState),
});

const mapDispatchToProps = dispatch => bindActionCreators({
	closeKwmSidebar,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(KwmSidebar);
