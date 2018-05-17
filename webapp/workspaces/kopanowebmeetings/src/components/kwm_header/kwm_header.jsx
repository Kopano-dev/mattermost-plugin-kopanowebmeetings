import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {getTheme} from 'mattermost-redux/selectors/entities/preferences';

import CallTimer from '@kopanowebmeetings/shared-components/src/CallTimer/CallTimer';
import './kwm_header.css';

const KwmHeader = props => (
	<div className='sidebar--right__header'>
		{props.showTimer ? <CallTimer startTime={props.startTime} color={props.theme.linkColor} /> : ''}
		<span className='sidebar--right__title'>{props.title}</span>
		<div className='pull-right'>
			<button
				type='button'
				className='sidebar--right__close'
				aria-label='Close'
				title='Close'
				onClick={props.onClose}
			>
				<i className='fa fa-sign-out' />
			</button>
		</div>
	</div>
);
KwmHeader.propTypes = {
	theme: PropTypes.object.isRequired,
	title: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired,
	showTimer: PropTypes.bool.isRequired,
	startTime: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
	showTimer: state.callStatus.started,
	startTime: state.callStatus.startTime,
	theme: getTheme(state.mattermostReduxState),
});

export default connect(mapStateToProps)(KwmHeader);
