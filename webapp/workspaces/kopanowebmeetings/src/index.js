import {getCurrentUser, getUser} from 'mattermost-redux/selectors/entities/users';

//import Plugin from 'components/Plugin.jsx';
import rootReducer from 'redux/rootReducer';
import {CameraFilled} from '@kopanowebmeetings/icons/src';
import RootContainer from 'redux/containers/RootContainer';
import {actions} from 'redux/ducks';
const {
	setConfig,
	kwmSetConnecting,
	kwmSetConnected,
	kwmSetNotConnected,
	kwmSetReconnecting,
	setError,
	addCaller,
	openSidebar,
	updateCaller,
	openCallNotificationWithTimeout,
	closeCallNotification,
	removeAllCallers,
	closeSidebar,
	startCallTimer,
	stopCallTimer,
} = actions;
import {getDirectTeammate, getConfig, getDisplayName} from 'utils/utils';
import {kwm, init as kwmInit} from 'utils/kwm';
import {getUserMedia} from 'utils/user_media';

class PluginClass {
	/* eslint-disable class-methods-use-this */
	initialize(registry, store) {
		// Keep a reference to the mattermost redux store
		this.store = store;

		this.initializeKWMConnection();

		registry.registerReducer(rootReducer);

		registry.registerChannelHeaderButtonAction(
			CameraFilled({height: '12px'}, 'kwm-start-btn'), // eslint-disable-line new-cap
			this.onClickChannelHeaderButton.bind(this),
			'Start a WebMeeting'
		);

		/*
		registry.registerChannelHeaderButtonAction(
			CameraFilled({height: '12px'}, 'kwm-start-btn'), // eslint-disable-line new-cap
			this.onClickChannelHeaderButton2.bind(this),
			'Fake button'
		);
		*/

		registry.registerRootComponent(RootContainer);
	}

	async onClickChannelHeaderButton(channel, channelMember) {
		await this.initializeVideoCall();
	}

	onClickChannelHeaderButton2(channel, channelMember) {
		console.log('Clicked the fake button');
		alert('hello world'); // eslint-disable-line no-alert
	}

	async initializeKWMConnection() {
		const {dispatch} = this.store;
		let config;
		try {
			config = await getConfig();
		} catch (err) {
			console.warn('Could not load config. Scheduling a retry after 30s', err);
			return setTimeout(this.initializeKWMConnection, 30000);
		}

		// Add the config to the state
		dispatch(setConfig(config));

		// Initialize the kwm api
		try {
			kwmInit(config);
		} catch (err) {
			console.error(err);
			// We don't have a valid config. Let's try to fetch it again
			return this.initializeKWMConnection();
		}

		// Schedule a refresh
		// TODO(longsleep): Check behavior when laptop was asleep / or when clock changes.
		const when = 0.9 * config.expires_in * 1000; // eslint-disable-line no-magic-numbers
		setTimeout(() => this.initializeKWMConnection(), when);

		this.addKwmListeners();
		await this.connectToKwmServer();
	}

	addKwmListeners() {
		const {dispatch, getState} = this.store;

		kwm.onstatechanged = event => {
			if ( event.connecting ) {
				dispatch(kwmSetConnecting());
			} else if ( event.connected ) {
				dispatch(kwmSetConnected());
			} else if ( event.reconnecting ) {
				dispatch(kwmSetReconnecting());
			}
		};

		kwm.onerror = event => {
			console.error('kwm error', event);
		};

		// Add the listener for events triggered by the remote user
		kwm.webrtc.onpeer = event => { //eslint-disable-line complexity
			switch (event.event) {
				case 'incomingcall': {
					console.log('incomingcall', event, calledBy);
					const calledById = event.record.user;
					const calledBy = getUser(getState(), calledById);
					dispatch(openCallNotificationWithTimeout(calledBy, () => {
						kwm.webrtc.doHangup(calledById, 'autoreject');
					}));
					break;
				}
				case 'outgoingcall':
					console.log('outgoingcall', event);
					// Call was accepted by peer
					break;
				case 'newcall':
					console.log('newcall', event);
					// Call was accepted by local user
					break;
				case 'destroycall':
					console.log('destroycall', event);
					kwm.webrtc.doHangup();
					//dispatch(destroyCall());
					dispatch(stopCallTimer());
					dispatch(closeCallNotification());
					dispatch(removeAllCallers());
					dispatch(closeSidebar());
					break;
				case 'abortcall': {
					console.log('abortcall', event);
					let message = 'Call aborted';
					if ( event.details === 'reject_busy' ) {
						message = 'The user you are calling is already in another call.';
					}
					dispatch(stopCallTimer());
					dispatch(closeCallNotification());
					dispatch(removeAllCallers());
					dispatch(closeSidebar());
					dispatch(setError({message}));
					kwm.webrtc.doHangup();
					break;
				}
				case 'hangup': {
					console.log('hangup', event);
					let message = null;
					const user = getUser(getState(), event.record.user);
					if ( event.details ) {
						switch (event.details.reason) {
							case 'autoreject':
								message = getDisplayName(user) + ' didn\'t pick up';
								break;
							case 'reject':
								message = getDisplayName(user) + ' rejected your call';
								break;
						}
					}
					if ( message ) {
						dispatch(setError({message}));
					}
					break;
				}
				case 'pc.error':
					break;
				default:
					// Unknown peer event
			}
		};

		// Add a listener for streams
		kwm.webrtc.onstream = event => {
			dispatch(startCallTimer());
			const callerId = event.record.user;
			dispatch(updateCaller(callerId, {
				stream: event.stream,
			}));
		};
	}

	async connectToKwmServer() {
		const {dispatch, getState} = this.store;
		const user = getCurrentUser(getState());

		dispatch(kwmSetConnecting());

		try {
			await kwm.connect(user.id);
		} catch (err) {
			dispatch(kwmSetNotConnected());
			console.error('connect to KWM failed', err);
			return;
		}

		dispatch(kwmSetConnected());
	}

	// Event handler for when the user has clicked a button to call another user
	async initializeVideoCall() {
		const {dispatch, getState} = this.store;

		let stream;
		try {
			stream = await getUserMedia();
		} catch (err) {
			console.error('error getting usermedia', err);
			dispatch(setError({message: 'No usermedia available!'}));
			return;
		}

		const currentUser = getCurrentUser(getState());
		const directTeammate = getDirectTeammate(getState());
		dispatch(addCaller({
			user: currentUser,
			initiator: true,
			self: true,
		}));
		dispatch(addCaller({
			user: directTeammate,
			focus: true,
		}));

		dispatch(openSidebar());

		kwm.webrtc.doCall(directTeammate.id);

		if (stream) {
			//dispatch(addLocalStream(stream));
			dispatch(updateCaller(currentUser.id, {stream}));
			kwm.webrtc.setLocalStream(stream);
		} else {
			kwm.webrtc.doHangup();
		}
	}
	/* eslint-enable class-methods-use-this */
}

window.registerPlugin('kopanowebmeetings', new PluginClass());
