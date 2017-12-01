import React from 'react';
import {connect} from 'react-redux';

import './kwm_videolist.css';
import {KwmHangUpButton} from 'components/kwm_buttons/kwm_buttons.jsx';
import {getDisplayName} from 'utils/utils.js';

const KwmVideoList = (props) => {
    console.log('props:', props)
    const onHangUp = props.onHangUp || (()=>console.log('Hangup not implemented'));

    let buttons = '';
    if ( props.callers.length ){
        buttons = (
            <div className="kwm-call-buttons">
                <KwmHangUpButton onHangUp={onHangUp} />
            </div>
        );
    }
    return (
        <div className='kwm-videolist'>
            {props.callers.sort((a, b) => (a.focus ? -1 : (b.focus ? 1 : 0))).map(caller => {
                const videoProps = {};
                if ( caller.stream ){
                    videoProps.src = window.URL.createObjectURL(caller.stream);
                }

                return (
                    <div className="kwm-video-container" key={caller.user.id}>
                        <video className="kwm-video" {...videoProps} />
                        <div className="kwm-video-title">{getDisplayName(caller.user)}</div>
                    </div>
                );
            })}
            {buttons}
        </div>
    );
};

const mapStateToProps = state => ({
    callers: state.callers,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    hangUp
});

export default connect(mapStateToProps)(KwmVideoList);
