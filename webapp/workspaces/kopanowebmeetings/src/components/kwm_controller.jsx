import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import classNames from 'classnames';

import * as Selectors from 'mattermost-redux/selectors/entities/users';

import * as Actions from 'actions/kwm_actions.js';
import Constants from 'utils/constants.js';
import {getDisplayName, getDirectTeammate} from 'utils/utils.js';
import {getUserMedia} from 'utils/user_media.js';

import {StartCallButton} from '@kopanowebmeetings/shared-components/src/buttons';
import KwmSidebar from 'components/kwm_sidebar/kwm_sidebar.jsx';
import CallNotification from 'reduxComponents/CallNotification.js';
import KwmVideoList from 'reduxComponents/VideoList.js';
import Messagebox from 'reduxComponents/Messagebox.js';

class KwmController extends React.PureComponent {
	constructor(props) {
		super(props);

		this.onInitializeVideoCall = this.onInitializeVideoCall.bind(this);
		this.onAcceptCall = this.onAcceptCall.bind(this);
		this.onRejectCall = this.onRejectCall.bind(this);
		this.onHangUp = this.onHangUp.bind(this);
	}

	componentDidMount() {
		this.initialize();
	}

	async initialize() {
		const {getConfig, updateKwmWebRTCConfig, createKwmObj, addKwmListeners, connectToKwmServer} = this.props;

		const retryInterval = 1.112;
		const maxRetryInterval = 20;
		let retry = 0;
		const refresh = async (config, update = false) => {
			let c = config;
			if (update) {
				try {
					c = await getConfig();
					await updateKwmWebRTCConfig();
					retry = 0;
				} catch (e) {
					// Failed to refresh config.
					retry++;
					let i = retryInterval * retry;
					if (i > maxRetryInterval) {
						i = maxRetryInterval;
					}
					c = {
						expires_in: i,
					};
				}
			}
			const when = (c.expires_in / 100) * 90 * 1000; // eslint-disable-line no-magic-numbers

			// TODO(longsleep): Check behavior when laptop was asleep / or when clock changes.
			setTimeout(refresh, when, c, true);
		};

		return getConfig().then(async config => {
			await createKwmObj();
			await updateKwmWebRTCConfig();
			await addKwmListeners();
			await connectToKwmServer();

			await refresh(config, false);
		});
	}

	// Event handler for the accept button of the call notification
	async onAcceptCall(calledBy) {
		const {
			kwm,
			currentUser,
			addCaller,
			updateCaller,
			startCallTimer,
			openKwmSidebar,
			destroyCall,
			closeCallNotification,
			addLocalStream,
			setError,
		} = this.props;

		let stream;
		try {
			stream = await getUserMedia();
		} catch (err) {
			console.error('error getting usermedia', err);
			setError({message: 'No usermedia available!'});
			destroyCall();
			return;
		}

		addCaller({
			user: currentUser,
			initiator: false,
		});
		addCaller({
			user: calledBy,
			initiator: true,
			focus: true,
		});

		closeCallNotification();
		openKwmSidebar();

		startCallTimer();

		addLocalStream(stream);
		updateCaller(currentUser.id, {stream});

		await kwm.webrtc.doAnswer(calledBy.id);
		kwm.webrtc.setLocalStream(stream);
	}

	// Event handler for the reject button of the call notification
	async onRejectCall(calledBy) {
		const {kwm, closeCallNotification} = this.props;

		closeCallNotification();

		// Notify the caller that we rejected
		await kwm.webrtc.doHangup(calledBy.id, 'reject');
	}

	// Event handler for the hangup button below the video list
	// (and for the close button of the sidebar)
	onHangUp() {
		const {kwm, removeAllCallers, closeKwmSidebar} = this.props;

		kwm.webrtc.doHangup();
		removeAllCallers();
		closeKwmSidebar();
	}

	// Event handler for when the user has clicked a button to call another user
	async onInitializeVideoCall() {
		const {
			kwm,
			currentUser,
			directTeammate,
			addCaller,
			updateCaller,
			addLocalStream,
			openKwmSidebar,
			destroyCall,
			setError,
		} = this.props;

		let stream;
		try {
			stream = await getUserMedia();
		} catch (err) {
			console.error('error getting usermedia', err);
			setError({message: 'No usermedia available!'});
			return;
		}

		addCaller({
			user: currentUser,
			initiator: true,
		});
		addCaller({
			user: directTeammate,
			focus: true,
		});
		openKwmSidebar();

		kwm.webrtc.doCall(directTeammate.id);

		if (stream) {
			addLocalStream(stream);
			updateCaller(currentUser.id, {stream});
			kwm.webrtc.setLocalStream(stream);
		} else {
			destroyCall();
		}
	}

	render() {
		const {getStatusForUserId, callersCount, connectionStatus, directTeammate} = this.props;
		const onClose = this.onHangUp;
		let title = '';

		let button = '';
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

		return (
			<div className='kwm-controller'>
				{button}
				<KwmSidebar onClose={onClose} title={title}>
					<KwmVideoList onHangUp={this.onHangUp} />
				</KwmSidebar>
				<CallNotification onAccept={this.onAcceptCall} onReject={this.onRejectCall} />
				<Messagebox />
			</div>
		);
	}
}
KwmController.propTypes = {
	kwm: PropTypes.object,
	removeAllCallers: PropTypes.func.isRequired,
	closeKwmSidebar: PropTypes.func.isRequired,
	currentUser: PropTypes.object.isRequired,
	directTeammate: PropTypes.object,
	getStatusForUserId: PropTypes.func.isRequired,
	callersCount: PropTypes.number.isRequired,
	connectionStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => {
	return {
		currentUser: Selectors.getCurrentUser(state.mattermostReduxState),
		getStatusForUserId: id => Selectors.getStatusForUserId(state.mattermostReduxState, id),
		directTeammate: getDirectTeammate(state.mattermostReduxState),
		kwm: state.kwmState.kwm,
		callersCount: state.callers.length,
		sidebarOpen: state.kwmSidebar.open,
		connectionStatus: state.kwmState.connected,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		...bindActionCreators({
			...Actions,
		}, dispatch),
		/*
		We could add actions from the Mattermost Redux store if needed with the following code:

		...bindActionCreators({
			// Add action creators of Mattermost here
		}, kwmStore.mmDispatch)
		*/
	};
};

// Use the state of the redux store by connecting
export default connect(mapStateToProps, mapDispatchToProps)(KwmController);