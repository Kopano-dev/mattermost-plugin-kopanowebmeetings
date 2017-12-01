import React from 'react';
import {bindActionCreators} from 'redux';
import {connect, Provider} from 'react-redux';

import * as Selectors from 'mattermost-redux/selectors/entities/users';

import * as KWM from 'kopano-webmeetings/kwm.js';

import kwmStore from 'store/kwm_store.js';
import {
    connect as kwmConnect,
    setConnectionStatus,
    setKwmError,
    openKwmSidebar,
    closeKwmSidebar,
    openCallNotification,
    closeCallNotification,
    addCaller,
    updateCaller,
    removeCaller,
    removeAllCallers
} from 'actions/kwm_actions.js';
import Constants from 'utils/constants.js';
import {getDisplayName, fetchKwmAdminToken} from 'utils/utils.js';
import {getUserMedia,stopUserMedia} from 'utils/user_media.js';

import {KwmStartButton} from 'components/kwm_buttons/kwm_buttons.jsx';
import KwmSidebar from 'components/kwm_sidebar/kwm_sidebar.jsx';
import KwmHeader from 'components/kwm_header/kwm_header.jsx';
import KwmCallNotification from 'components/kwm_call_notification/kwm_call_notification.jsx';
import KwmVideoList from 'components/kwm_videolist/kwm_videolist.jsx';

class KwmController extends React.Component {
    constructor(props) {
        super(props);

        const {kwmConnect, getCurrentUser} = this.props;

        this.onInitializeVideoCall = this.onInitializeVideoCall.bind(this);
        this.onAcceptCall = this.onAcceptCall.bind(this);
        this.onRejectCall = this.onRejectCall.bind(this);
        this.hangUp = this.hangUp.bind(this);

        const kwmOptions = {};
        this.kwm = new KWM('https://ronald:8843', kwmOptions);
        this.kwm.connectionOptions = kwmOptions;
		this.kwm.webrtc.config = {
            iceServers: [
                {url: 'stun:stun.l.google.com:19302'}
            ]
        };
        this.addKwmListeners();
        kwmConnect(this.kwm, getCurrentUser().id);
    }

    addKwmListeners() {
        console.log('KwmController.addKwmListeners');
        const {getUser, openCallNotification, closeCallNotification, updateCaller} = this.props;

        this.kwm.onstatechanged = event => {
            if (event.connecting) {
                const status =
                    event.connecting ? Constants.KWM_CONN_STATUS_CONNECTING : (
                    event.connected ? Constants.KWM_CONN_STATUS_CONNECTED : (
                    event.reconnecting ? Constants.KWM_CONN_STATUS_RECONNECTING : undefined
                ));
                setConnectionStatus(status);
            }
        }

        this.kwm.onerror = event => {
            setKwmError(event);
        }

        // Add the listener for events triggered by the remote user
		this.kwm.webrtc.onpeer = event => {
            switch (event.event) {
                case 'incomingcall':
                    console.log('incoming call', event);
                    const calledById = event.record.user;
                    openCallNotification(getUser(calledById));
                    break;
                case 'newcall':
                    console.log('newcall');
                    break;
                case 'destroycall':
                    console.log('destroycall');
                    closeCallNotification();
                    this.hangUp();
                    break;
                case 'abortcall':
                    console.log('abortcall');
                    break;
                case 'pc.error':
                    console.log('pc.error');
                    break;
                default:
                    console.log('unknown peer event: ', event.event, event);
            }
        }

        // Add a listener for streams
		this.kwm.webrtc.onstream = event => {
			console.log('onstream', event);
            const callerId = event.record.user;
            updateCaller(callerId, {
                stream: event.stream
            });

		};
    }

    async onAcceptCall(calledBy) {
        const {getCurrentUser, getUser, addCaller, updateCaller, openKwmSidebar, closeCallNotification} = this.props;

        addCaller({
            user: getCurrentUser(),
            initiator: false
        });
        addCaller({
            user: calledBy,
            initiator: true,
            focus: true
        });

        closeCallNotification();
        openKwmSidebar();

        const stream = await getUserMedia();
        this.localStream = stream;
        updateCaller(getCurrentUser().id, {
            stream
        });
        this.kwm.webrtc.setLocalStream(stream);
        const channel = await this.kwm.webrtc.doAnswer(calledBy.id);
    }

    async onRejectCall(calledBy) {
        const {closeCallNotification} = this.props;

        closeCallNotification();

        // Notify the caller that we rejected
		const channel = await this.kwm.webrtc.doHangup(calledBy.id, 'reject');
		console.log('doHangup reject sent', channel);
    }

    hangUp() {
        console.log('controller hangup')

        this.kwm.webrtc.doHangup();

        this.closeKwmSidebar();
    }

    closeKwmSidebar() {
        const {removeAllCallers, closeKwmSidebar} = this.props;

        removeAllCallers();
        if ( this.localStream ){
            stopUserMedia(this.localStream);
            this.localStream = undefined;
        }
        closeKwmSidebar();
    }

    // Called when the close button of the sidebar is clicked
    onCloseKwmSidebar() {
        //TODO: Show warning to the user if there is a connection

        // TODO: Check if
        this.hangup();
    }

    /**
     * Event handler for when the user has clicked a button to call another user
     * @param  {String}  userId The id of the remote user
     */
    async onInitializeVideoCall() {
        console.log('onInitializeVideoCall')
        const {getCurrentUser, getUser, getProfilesInCurrentChannel, addCaller, updateCaller, openKwmSidebar} = this.props;
        const remoteUser = getProfilesInCurrentChannel()[0];
        const remoteUserId = remoteUser.id;

        addCaller({
            user: getCurrentUser(),
            initiator: true
        });
        addCaller({
            user: getUser(remoteUserId),
            focus: true
        });
        openKwmSidebar();

        this.kwm.webrtc.doCall(remoteUserId);

        console.log('onInitializeVideoCall => getting user media')
        const stream = await getUserMedia();
        this.localStream = stream;
        console.log('stream fetched! updating caller');
        updateCaller(getCurrentUser().id, { stream });
        console.log('stream fetched! setLocalStream');
        this.kwm.webrtc.setLocalStream(stream);
    }

    render() {
        const {getCurrentUser, getProfilesInCurrentChannel, getStatusForUserId, callersCount, connectionStatus} = this.props;
        const onClose = this.hangUp;
        let title = '';

        let button = '';
        if ( getProfilesInCurrentChannel().length === 1 ){
            const remoteUser = getProfilesInCurrentChannel()[0];
            const userName = getDisplayName(remoteUser);
            title = 'Calling ' + userName;
            const userStatus = getStatusForUserId(remoteUser.id);
            button = <KwmStartButton
                        className="channel-header__icon"
                        inCall={callersCount>1}
                        disabled={connectionStatus!==Constants.KWM_CONN_STATUS_CONNECTED || !(userStatus===Constants.UserStatuses.ONLINE || userStatus===Constants.UserStatuses.AWAY) }
                        onStartCall={this.onInitializeVideoCall}
                    />;
        }

        return (
            <div className="kwm-controller">
                {button}
                <KwmSidebar onClose={onClose} title={title}>
                    <KwmVideoList onHangUp={this.hangUp} />
                </KwmSidebar>
                <KwmCallNotification onAccept={this.onAcceptCall} onReject={this.onRejectCall} />
            </div>
        );
    }
};

const mapStateToProps = state => {
    console.log('state=', state)
    return {
        getUser: id => Selectors.getUser(state.mattermostReduxState, id),
        getCurrentUser: () => Selectors.getCurrentUser(state.mattermostReduxState),
        getProfilesInCurrentChannel: () => Selectors.getProfilesInCurrentChannel(state.mattermostReduxState),
        getStatusForUserId: id => Selectors.getStatusForUserId(state.mattermostReduxState, id),

        callersCount: state.callers.length,
        sidebarOpen: state.kwmSidebar.open,
        connectionStatus: state.kwmState.connected,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        ...bindActionCreators({
            kwmConnect,
            openKwmSidebar,
            closeKwmSidebar,
            addCaller,
            updateCaller,
            removeCaller,
            removeAllCallers,
            openCallNotification,
            closeCallNotification,
        }, dispatch),
/*
        We could add actions from the Mattermost Redux store if needed with the following code:

        ...bindActionCreators({
            // Add action creators of Mattermost here
        }, kwmStore.mmDispatch)
*/
    };
}

// Use the state of the redux store by connecting
export default connect(mapStateToProps, mapDispatchToProps)(KwmController);
