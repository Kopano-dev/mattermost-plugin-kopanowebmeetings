import React from 'react';
import {connect} from 'react-redux';

import './kwm_call_notification.css';

import {KwmCallButton, KwmHangUpButton} from 'components/kwm_buttons/kwm_buttons.jsx';
import * as Utils from 'utils/utils.js'

const KwmCallNotification = props => {
    const {open, calledBy} = props;

    if ( !open ){
        return null;
    }

    const userName = Utils.getDisplayName(calledBy);
    const src = Utils.imageURLForUser(calledBy);

    const onAccept = () => props.onAccept(props.calledBy);
    const onReject = () => props.onReject(props.calledBy);

    return (
        <div className='kwm-call-notification'>
            <div className='kwm-call-notification-body'>
                <div className='kwm-profile-image-container'>
                    <img src={src} />
                </div>
                <div className='kwm-call-notification-msg'>
                    {'Incoming call from ' + userName + '. Accept or reject.'}
                </div>
            </div>
            <div className="kwm-call-buttons">
                <KwmCallButton onAccept={onAccept} />
                <KwmHangUpButton onReject={onReject} />
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    open: state.callNotification.open,
    calledBy: state.callNotification.calledBy,
    state
});

export default connect(mapStateToProps)(KwmCallNotification);
