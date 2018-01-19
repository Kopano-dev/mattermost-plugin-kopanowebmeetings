import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import './kwm_call_notification.css';
import ring from 'sounds/ring.mp3';

import {KwmCallButton, KwmHangUpButton} from 'components/kwm_buttons/kwm_buttons.jsx';
import * as Utils from 'utils/utils.js';
import {cameraOutlined} from 'utils/icons.jsx';

const KwmCallNotification = props => {
	if ( !props.open ) {
		return null;
	}

	const userName = Utils.getDisplayName(props.calledBy);
	const src = Utils.imageURLForUser(props.calledBy);

	const onAccept = () => props.onAccept(props.calledBy);
	const onReject = () => props.onReject(props.calledBy);

	return (
		<div className='kwm-call-notification'>
			<div className='kwm-call-notification-header'>
				{cameraOutlined()}
				{'Incoming call'}
			</div>
			<div className='kwm-call-notification-body'>
				<div className='kwm-profile-image-container'>
					<img src={src} />
				</div>
				<div className='kwm-call-notification-msg'>
					{userName}
				</div>
			</div>
			<div className='kwm-call-buttons'>
				<KwmCallButton onAccept={onAccept} />
				<KwmHangUpButton onReject={onReject} />
			</div>
			<audio src={ring} autoPlay={true} loop={true} />
		</div>
	);
};
KwmCallNotification.propTypes = {
	open: PropTypes.bool.isRequired,
	calledBy: PropTypes.object,
	onAccept: PropTypes.func.isRequired,
	onReject: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	open: state.callNotification.open,
	calledBy: state.callNotification.calledBy,
});

export default connect(mapStateToProps)(KwmCallNotification);
