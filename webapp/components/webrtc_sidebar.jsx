import React from 'react';

import WebrtcController from 'components/webrtc_controller.jsx';

export default class WebrtcSidebar extends React.Component {
    constructor(props) {
        super(props);

        this.plScrolledToBottom = true;

        this.onShrink = this.onShrink.bind(this);
        this.onInitializeVideoCall = this.onInitializeVideoCall.bind(this);
        this.doStrangeThings = this.doStrangeThings.bind(this);

        this.state = {
            expanded: false,
            videoCallVisible: false,
            isCaller: false,
            videoCallWithUser: null
        };
    }

    componentDidMount() {
        let { WebrtcStore } = this.props.stores;
        WebrtcStore.addInitListener(this.onInitializeVideoCall);
        this.doStrangeThings();
    }

    componentWillUnmount() {
        let { WebrtcStore } = this.props.stores;
        WebrtcStore.removeInitListener(this.onInitializeVideoCall);
    }

    shouldComponentUpdate(nextProps, nextState) {
        let { Utils } = this.props;
        return !Utils.areObjectsEqual(nextState, this.state);
    }

    removeClassFromElement(elementSelector, classNames) {
        let el;

        if ( !Array.isArray(classNames) ) classNames = [classNames];

        if ( el = document.querySelector(elementSelector) ){
            classNames.forEach(className => el.classList.remove(className));
        }
    }

    addClassToElement(elementSelector, classNames) {
        let el;

        if ( !Array.isArray(classNames) ) classNames = [classNames];

        if ( el = document.querySelector(elementSelector) ){
            classNames.forEach(className => el.classList.add(className));
        }
    }

    doStrangeThings() {
        console.log('doStrangeThings');
        // We should have a better way to do this stuff
        // Hence the function name.
        let el;
        this.removeClassFromElement('.app__body .inner-wrap', 'move--right');
        this.addClassToElement('.app__body .inner-wrap', ['webrtc--show', 'move--left']);
        this.removeClassFromElement('.app__body .sidebar--left', 'move--right');
        this.removeClassFromElement('.multi-teams .team-sidebar', 'move--right');
        this.addClassToElement('.app__body .webrtc', 'webrtc--show');

        if (!this.state.videoCallVisible) {
            this.removeClassFromElement('.app__body .inner-wrap', ['webrtc--show', 'move--left', 'move--right']);
            this.removeClassFromElement('.app__body .webrtc', 'webrtc--show');
            return (
                <div/>
            );
        }

        return null;
    }

    componentDidUpdate() {
        this.doStrangeThings();
    }

    onShrink() {
        this.setState({expanded: false});
    }

    onInitializeVideoCall(userId, isCaller) {
        let { UserStore } = this.props.stores;
        let expanded = this.state.expanded;

        if (userId === null) {
            expanded = false;
        }
        this.setState({
            videoCallVisible: (userId !== null),
            isCaller,
            videoCallWithUser: UserStore.getProfile(userId),
            expanded
        });

        if (userId !== null) {
            console.log('onInitializeVideoCall => calling forceUpdate');
            this.forceUpdate();
        }
    }

    render() {
        console.log('render. state =', this.state, this.props)

        let content = null;
        let expandedClass = '';
        let { UserStore } = this.props.stores;

        if (this.state.videoCallVisible) {
            console.log('adding content', UserStore.getProfile(this.state.videoCallWithUser) )
            content = (
                <WebrtcController
                    currentUser={this.state.currentUser}
                    userId={this.state.videoCallWithUser.id}
                    isCaller={this.state.isCaller}
                    expanded={this.state.expanded}
                    toggleSize={this.toggleSize}
                    stores={this.props.stores}
                    Utils={this.props.Utils}
                    Constants={this.props.Constants}
                    WebSocketClient={this.props.WebSocketClient}
                    AppDispatcher={this.props.AppDispatcher}
                />
            );
        }

        if (this.state.expanded) {
            expandedClass = 'sidebar--right--expanded';
        }

        return (
            <div
                className={'sidebar--right webrtc ' + expandedClass}
                id='sidebar-webrtc'
            >
                <div
                    onClick={this.onShrink}
                    className='sidebar--right__bg'
                />
                <div className='sidebar-right-container'>
                    {content}
                </div>
            </div>
        );
    }

}
