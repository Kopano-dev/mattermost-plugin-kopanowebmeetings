import React from 'react';
import PropTypes from 'prop-types';

import './CallNotification.css';
import ring from './sounds/ring.mp3';

import {PickupCallButton, HangupCallButton} from '../buttons';
import {cameraOutlined} from '../icons';

/**
 * Creates an element that can be used as image.
 *
 * @param {string} imgUrl Url of an image that can be used as avatar
 * @param {string} userName Full name of the user
 * @return {ReactElement} Can be an img element if an imgUrl is given, or a div
 * with initials of the user otherwise.
 */
const createImageElement = (imgUrl, userName) => {
	if ( imgUrl ) {
		return <img src={imgUrl} />;
	}

	// TODO: We should use an avatar component for this
	let initials = userName.split(/\s+/);
	if ( initials.length > 2 ) {
		initials.length = 2;
	}
	initials = initials.map(name => name[0].toUpperCase()).join('');

	return <div className='k-cn-avatar'>{initials}</div>;
};

const propTypes = {
	open: PropTypes.bool.isRequired,
	title: PropTypes.string,
	userName: PropTypes.string.isRequired,
	imgUrl: PropTypes.string,
	onAccept: PropTypes.func.isRequired,
	onReject: PropTypes.func.isRequired,
};
const defaultProps = {
	title: 'Incoming call',
};

const CallNotification = props => {
	if ( !props.open ) {
		return null;
	}

	const img = createImageElement(props.imgUrl, props.userName);

	return (
		<div className='kwm-call-notification'>
			<div className='kwm-call-notification-header'>
				{cameraOutlined()}
				{props.title}
			</div>
			<div className='kwm-call-notification-body'>
				<div className='kwm-profile-image-container'>
					{img}
				</div>
				<div className='kwm-call-notification-msg'>
					{props.userName}
				</div>
			</div>
			<div className='kwm-call-buttons'>
				<PickupCallButton onClick={props.onAccept} />
				<HangupCallButton onClick={props.onReject} />
			</div>
			<audio src={ring} autoPlay={true} loop={true} />
		</div>
	);
};
CallNotification.propTypes = propTypes;
CallNotification.defaultProps = defaultProps;

export default CallNotification;