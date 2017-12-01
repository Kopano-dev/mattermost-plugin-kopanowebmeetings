import React from 'react';

import './kwm_buttons.css';
import Constants from 'utils/constants.js';
import {cameraOutlined, cameraFilled} from 'utils/icons.jsx';

export const KwmStartButton = props => {
    const onStartCall = props.onStartCall || (()=>console.warn('onStartCall handler not defined!'));
    const styles = {};
    if ( props.size ){
        styles.width = props.size + 'px';
        styles.height = props.size + 'px';
    }
    let className = props.className ? props.className : '';
    const attrs = {};
    if ( props.inCall ){
        attrs.disabled = 'true';
        className += ' kwm-incall';
    }
    if ( props.disabled ){
        attrs.disabled = 'true';
    }

    const icon = props.inCall ? cameraFilled() : cameraOutlined();

    return (
            <button className={"kwm-btn kwm-start-call style--none "+className} {...attrs} onClick={onStartCall}>
                {icon}
            </button>
    );
};

export const KwmCallButton = props => {
    const onCall = props.onCall || props.onAccept || (()=>console.warn('onCall handler not defined!'));
    const styles = {};
    if ( props.size ){
        styles.width = props.size + 'px';
        styles.height = props.size + 'px';
    }

    return <button className="kwm-btn kwm-accept" onClick={onCall}><i className="fa fa-phone" style={styles} aria-hidden="true"></i></button>;
};

export const KwmHangUpButton = props => {
    const onHangUp = props.onHangUp || props.onReject || (()=>console.warn('onHangUp handler not defined!'));
    const styles = {};
    if ( props.size ){
        styles.width = props.size + 'px';
        styles.height = props.size + 'px';
    }

    return <button className="kwm-btn kwm-reject" onClick={onHangUp}><i className="fa fa-phone" style={styles} aria-hidden="true"></i></button>;
};

const KwmButtons = {
    KwmCallButton,
    KwmHangUpButton,
};
export default KwmButtons;
