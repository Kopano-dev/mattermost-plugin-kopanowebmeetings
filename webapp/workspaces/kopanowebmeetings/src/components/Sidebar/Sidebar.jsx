import React from 'react';
import PropTypes from 'prop-types';
//import {bindActionCreators} from 'redux';
//import {connect} from 'react-redux';
import rgba from 'rgba-convert';

//import {getTheme} from 'mattermost-redux/selectors/entities/preferences';
import {makeStyleFromTheme} from 'mattermost-redux/utils/theme_utils';

import './sidebar.css';

import Header from 'redux/containers/Header';
import ActiveCallButtons from 'components/ActiveCallButtons';
import VideoList from 'redux/containers/VideoList';
import {removeClassFromElement, addClassToElement} from 'utils/utils.js';

const propTypes = {
	theme: PropTypes.object.isRequired,
	isOpen: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	onHangUp: PropTypes.func.isRequired,
};

export default class KwmSidebar extends React.Component {
	// This lifecycle method will make sure that the render method is only
	// called when we have a new title or a if the sidebar should be opened
	// or closed
	shouldComponentUpdate(nextProps) {
		return (
			nextProps.isOpen !== this.props.isOpen ||
			nextProps.title !== this.props.title
		);
	}
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
				<Header title={this.props.title} />
				<VideoList />
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

