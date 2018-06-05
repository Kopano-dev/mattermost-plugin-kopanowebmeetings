import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import rgba from 'rgba-convert';

import {getTheme} from 'mattermost-redux/selectors/entities/preferences';
import {makeStyleFromTheme} from 'mattermost-redux/utils/theme_utils';

import {Views} from 'utils/constants';
import {openFullScreen, openKwmSidebar} from 'actions/kwm_actions';
import {OpenFullScreenButton, CloseFullScreenButton} from '@kopanowebmeetings/shared-components/src/buttons';
import CallTimer from '@kopanowebmeetings/shared-components/src/CallTimer/CallTimer';
import './kwm_header.css';

const KwmHeader = props => {
	const buttons = (
		<div className='pull-right k-header-buttons'>
			{props.showFullScreenButton ? <OpenFullScreenButton onClick={() => props.openFullScreen()} /> : null }
			{props.showSidebarButton ? <CloseFullScreenButton onClick={() => props.openSideBar()} /> : null }
		</div>
	);

	const style = getStyle(props.theme);

	return (
		<div className='k-header' style={style.header}>
			{props.showTimer ? <CallTimer startTime={props.startTime} color={props.theme.linkColor} /> : ''}
			<span className='k-header-title'>{props.title}</span>
			{buttons}
		</div>
	);
};
KwmHeader.propTypes = {
	theme: PropTypes.object.isRequired,
	title: PropTypes.string.isRequired,
	showTimer: PropTypes.bool.isRequired,
	startTime: PropTypes.number.isRequired,
	openSideBar: PropTypes.func.isRequired,
	openFullScreen: PropTypes.func.isRequired,
	showFullScreenButton: PropTypes.bool,
	showSidebarButton: PropTypes.bool,
};

const getStyle = makeStyleFromTheme( theme => {
	// Mattermost uses color opacity for the borders, so
	// let's just do the same.
	const c = rgba.obj(theme.centerChannelColor);
	c.a = 0.2 * 255; // eslint-disable-line no-magic-numbers
	return {
		header: {
			borderColor: rgba.css(c),
		},
	};
});

const mapStateToProps = state => ({
	showTimer: state.callStatus.started,
	startTime: state.callStatus.startTime,
	showFullScreenButton: state.view !== Views.FULLSCREEN,
	showSidebarButton: state.view !== Views.SIDEBAR,
	theme: getTheme(state.mattermostReduxState),
});
const mapDispatchToProps = dispatch => ({
	openSideBar: () => dispatch(openKwmSidebar()),
	openFullScreen: () => dispatch(openFullScreen()),
});

export default connect(mapStateToProps, mapDispatchToProps)(KwmHeader);
