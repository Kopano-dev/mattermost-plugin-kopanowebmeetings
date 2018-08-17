import React from 'react';
import PropTypes from 'prop-types';

import {getDisplayName} from 'utils/utils.js';
import {getUserMedia, stopUserMedia} from 'utils/user_media.js';
import {kwm} from 'utils/kwm';
import FullScreenContainer from 'redux/containers/FullScreenContainer';
import CallNotification from 'redux/containers/CallNotification';
import Messagebox from 'redux/containers/Messagebox';
import Sidebar from 'redux/containers/Sidebar';
import HeaderButton from 'redux/containers/HeaderButton';

export default class RootContainer extends React.Component {
	constructor(props) {
		super(props);

		//this.onInitializeVideoCall = this.onInitializeVideoCall.bind(this);
		this.onAcceptCall = this.onAcceptCall.bind(this);
		this.onRejectCall = this.onRejectCall.bind(this);
		this.onHangUp = this.onHangUp.bind(this);
	}

	shouldComponentUpdate(nextProps) {
		return (
			(this.props.currentChannel && !nextProps.currentChannel) ||
			(!this.props.currentChannel && nextProps.currentChannel) ||
			this.props.currentChannel.id !== nextProps.currentChannel.id
		);
	}

	// Event handler for the accept button of the call notification
	async onAcceptCall(calledBy) {
		console.log('onAcceptCall', calledBy);
		const {
			currentUser,
			addCaller,
			updateCaller,
			openSidebar,
			closeCallNotification,
			setError,
		} = this.props;

		let stream;
		try {
			stream = await getUserMedia();
		} catch (err) {
			console.error('error getting usermedia', err);
			setError({message: 'No usermedia available!'});
			kwm.webrtc.doHangup();
			//destroyCall();
			return;
		}

		addCaller({
			user: currentUser,
			self: true,
			initiator: false,
		});
		addCaller({
			user: calledBy,
			initiator: true,
			focus: true,
		});

		closeCallNotification();
		openSidebar();
		updateCaller(currentUser.id, {stream});

		await kwm.webrtc.doAnswer(calledBy.id);
		kwm.webrtc.setLocalStream(stream);
	}

	// Event handler for the reject button of the call notification
	async onRejectCall(calledBy) {
		const {closeCallNotification} = this.props;

		closeCallNotification();

		// Notify the caller that we rejected
		await kwm.webrtc.doHangup(calledBy.id, 'reject');
	}

	// Event handler for the hangup button below the video list
	// (and for the close button of the sidebar)
	onHangUp() {
		const {removeAllCallers, closeSidebar, getOwnStreamFromState} = this.props;

		kwm.webrtc.doHangup();
		stopUserMedia(getOwnStreamFromState());
		removeAllCallers();
		closeSidebar();
	}

	render() {
		console.log('RootContainer.render');
		const {directTeammate} = this.props;
		let title = '';
		if ( directTeammate ) {
			const userName = getDisplayName(directTeammate);
			title = 'Calling ' + userName;
		}

		/*
		const {getStatusForUserId, callersCount, connectionStatus, directTeammate} = this.props;
		let title = '';

		// let button = '';
		if ( directTeammate ) {
			const userName = getDisplayName(directTeammate);
			title = 'Calling ' + userName;

			const userStatus = getStatusForUserId(directTeammate.id);
			button = (
				<StartCallButton
					className={classNames('channel-header__icon', {active: callersCount > 1})}
					attrs={{
						disabled:
							callersCount > 1 ||
							connectionStatus !== Constants.KWM_CONN_STATUS_CONNECTED ||
							!(userStatus === Constants.UserStatuses.ONLINE ||
							userStatus === Constants.UserStatuses.AWAY),
					}}
					onClick={this.onInitializeVideoCall}
				/>
			);
		}
		*/

		return (
			<div className='kwm-rootcontainer'>
				<HeaderButton />
				<Sidebar title={title} onHangUp={this.onHangUp} />
				<FullScreenContainer title={title} onHangUp={this.onHangUp} />
				<CallNotification onAccept={this.onAcceptCall} onReject={this.onRejectCall} />
				<Messagebox />
			</div>
		);
	}
}
RootContainer.propTypes = {
	currentChannel: PropTypes.object.isRequired,
	removeAllCallers: PropTypes.func.isRequired,
	closeSidebar: PropTypes.func.isRequired,
	directTeammate: PropTypes.object,
	getOwnStreamFromState: PropTypes.func.isRequired,
};
