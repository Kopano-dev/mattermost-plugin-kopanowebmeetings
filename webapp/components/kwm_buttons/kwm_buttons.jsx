import React from 'react';
import PropTypes from 'prop-types';

import './kwm_buttons.css';
import {cameraOutlined, cameraFilled, pickupPhone, hangupPhone} from 'utils/icons.jsx';

export const KwmStartButton = props => {
	const onStartCall = props.onStartCall || (() => console.warn('onStartCall handler not defined!'));
	const styles = {};
	if ( props.size ) {
		styles.width = props.size + 'px';
		styles.height = props.size + 'px';
	}
	let className = props.className ? props.className : '';
	const attrs = {};
	if ( props.inCall ) {
		attrs.disabled = 'true';
		className += ' active';
	}
	if ( props.disabled ) {
		attrs.disabled = 'true';
	}

	const icon = props.inCall ? cameraFilled() : cameraOutlined();

	return (
		<button className={'kwm-btn kwm-start-call style--none ' + className} {...attrs} onClick={onStartCall}>
			{icon}
		</button>
	);
};
KwmStartButton.propTypes = {
	onStartCall: PropTypes.func,
	size: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]),
	className: PropTypes.string,
	inCall: PropTypes.bool,
	disabled: PropTypes.bool,
};

export const KwmCallButton = props => {
	const onCall = props.onCall || props.onAccept || (() => console.warn('onCall handler not defined!'));
	const styles = {};
	if ( props.size ) {
		styles.width = props.size + 'px';
		styles.height = props.size + 'px';
	}

	const icon = pickupPhone();

	return (
		<button className='kwm-btn kwm-accept' onClick={onCall}>
			{icon}
		</button>
	);
};
KwmCallButton.propTypes = {
	onCall: PropTypes.func,
	onAccept: PropTypes.func,
	size: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]),
};

export const KwmHangUpButton = props => {
	const onHangUp = props.onHangUp || props.onReject || (() => console.warn('onHangUp handler not defined!'));
	const styles = {};
	if ( props.size ) {
		styles.width = props.size + 'px';
		styles.height = props.size + 'px';
	}
	const icon = hangupPhone();

	return (
		<button className='kwm-btn kwm-reject' onClick={onHangUp}>
			{icon}
		</button>
	);
};
KwmHangUpButton.propTypes = {
	onHangUp: PropTypes.func,
	onReject: PropTypes.func,
	size: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]),
};

const KwmButtons = {
	KwmStartButton,
	KwmCallButton,
	KwmHangUpButton,
};
export default KwmButtons;
