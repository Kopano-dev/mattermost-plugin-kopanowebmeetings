import React from 'react';
import PropTypes from 'prop-types';

import './FullScreenContainer.css';
import KwmHeader from 'components/kwm_header/kwm_header.jsx';
import KwmVideoList from 'reduxComponents/VideoList.js';
import ActiveCallButtons from 'components/ActiveCallButtons';
import {getDisplayName} from 'utils/utils';

const propTypes = {
	// Set to true to show the FullScreenContainer
	isOpen: PropTypes.bool,
	// The title shown in the header
	title: PropTypes.string.isRequired,
	// The styles of the container
	styles: PropTypes.object,
	// The caller that is focussed (will be shown large)
	focussedCaller: PropTypes.object,
	// Set to true if the focussed caller is the local user
	self: PropTypes.bool.isRequired,
	// The event handler for the hangup button
	onHangUp: PropTypes.func.isRequired,
	// The event handler for a click on a video in the video list
	// The arguments are a caller object, and the event object
	onVideoClick: PropTypes.func.isRequired,
};
const defaultProps = {
	isOpen: false,
};
class FullScreenContainer extends React.Component {
	// This lifecycle method will make sure that the render method is only
	// called when we have a new focussed called
	shouldComponentUpdate(nextProps) {
		if ( nextProps.isOpen !== this.props.isOpen ) {
			return true;
		}

		if ( !nextProps.focussedCaller ) {
			return false;
		}
		if ( !this.props.focussedCaller ) {
			return true;
		}
		return nextProps.focussedCaller.user.id !== this.props.focussedCaller.user.id;
	}

	// This lifecycle method is used to add the stream the the video element
	// of the focussed caller
	componentDidUpdate() {
		if ( !this.props.focussedCaller ) {
			return;
		}

		const video = document.getElementById('k-focussed-video');
		if ( video ) {
			video.srcObject = this.props.focussedCaller.stream;
		}
	}

	render() {
		if ( !this.props.isOpen ) {
			document.body.classList.remove('k-fullscreenwebrtc');

			return null;
		}

		document.body.classList.add('k-fullscreenwebrtc');

		let displayName = '';
		if ( this.props.focussedCaller ) {
			displayName = this.props.self ? 'You' : getDisplayName(this.props.focussedCaller.user);
		}

		return (
			<div id='k-fullscreencontainer' style={this.props.styles.fullscreencontainer}>
				<KwmHeader title={this.props.title} />
				<div className='k-fullscreencontainer-body'>
					<div className='k-focussed-video-container'data-self={this.props.self} >
						{this.props.focussedCaller ? <video className='k-video' id='k-focussed-video' autoPlay='true' /> : null}
						{this.props.focussedCaller ? <div className='k-video-title'>{displayName}</div> : null}
						<ActiveCallButtons onHangUp={this.props.onHangUp} />
					</div>
					<div className='k-fullscreen-videolist-container'>
						<KwmVideoList onVideoClick={this.props.onVideoClick} />
					</div>
				</div>
			</div>
		);
	}
}
FullScreenContainer.propTypes = propTypes;
FullScreenContainer.defaultProps = defaultProps;

export default FullScreenContainer;