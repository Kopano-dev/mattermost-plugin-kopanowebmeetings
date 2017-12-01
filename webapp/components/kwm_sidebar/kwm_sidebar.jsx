import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import './kwm_sidebar.css';

import kwmStore from 'store/kwm_store.js';
import {closeKwmSidebar} from 'actions/kwm_actions.js';

import KwmHeader from 'components/kwm_header/kwm_header.jsx';
import Constants from 'utils/constants.js';
import {getFullName, removeClassFromElement, addClassToElement} from 'utils/utils.js';

const KwmSidebar = props => {
    const show = () => {
        removeClassFromElement('.app__body .inner-wrap', 'move--right');
        addClassToElement('.app__body .inner-wrap', ['webrtc--show', 'move--left']);
        removeClassFromElement('.app__body .sidebar--left', 'move--right');
        removeClassFromElement('.multi-teams .team-sidebar', 'move--right');
        addClassToElement('.app__body .webrtc', 'webrtc--show');
    };

    const hide = () => {
        removeClassFromElement('.app__body .inner-wrap', ['webrtc--show', 'move--left', 'move--right']);
        removeClassFromElement('.app__body .webrtc', 'webrtc--show');
    };

//    let expandedClass = '';
    const {isOpen, closeKwmSidebar, remoteUsers} = props;
    const username = (remoteUsers.length ? getFullName(remoteUsers[0]) : '');

    if ( !isOpen ){
        hide();
        return <div/>;
    }

    show();

    return (
        <div className='sidebar--right webrtc' id='sidebar-webrtc'>
            <div className='sidebar--right__bg' />
            <div className='sidebar-right-container'>
                <div className='sidebar--right__content'>
                    <div className='search-bar__container channel-header alt'></div>
                    <div className='sidebar-right__body'>
                        <KwmHeader onClose={props.onClose} title={props.title} />
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    isOpen: state.kwmSidebar.open,
    remoteUsers: state.remoteUsers || [],
});

const mapDispatchToProps = dispatch => bindActionCreators({
    closeKwmSidebar
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(KwmSidebar);
