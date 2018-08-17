import React from 'react';
import PropTypes from 'prop-types';
import rgba from 'rgba-convert';

import {makeStyleFromTheme} from 'mattermost-redux/utils/theme_utils';

import {OpenFullScreenButton, CloseFullScreenButton} from '@kopanowebmeetings/shared-components/src/buttons';
import CallTimer from '@kopanowebmeetings/shared-components/src/CallTimer/CallTimer';
import './header.css';

const propTypes = {
	theme: PropTypes.object.isRequired,
	title: PropTypes.string.isRequired,
	showTimer: PropTypes.bool.isRequired,
	startTime: PropTypes.number.isRequired,
	openSidebar: PropTypes.func.isRequired,
	openFullScreen: PropTypes.func.isRequired,
	showFullScreenButton: PropTypes.bool,
	showSidebarButton: PropTypes.bool,
};
const Header = props => {
	const buttons = (
		<div className='pull-right k-header-buttons'>
			{props.showFullScreenButton ? <OpenFullScreenButton onClick={() => props.openFullScreen()} /> : null }
			{props.showSidebarButton ? <CloseFullScreenButton onClick={() => props.openSidebar()} /> : null }
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
Header.propTypes = propTypes;

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

export default Header;
