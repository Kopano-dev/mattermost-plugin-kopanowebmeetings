import React from 'react';
import PropTypes from 'prop-types';

import './VideoList.css';
import {HangupCallButton} from '../buttons';

const propTypes = {
	onHangUp: PropTypes.func,
	callers: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		displayName: PropTypes.string.isRequired,
		stream: PropTypes.object,
		focus: PropTypes.bool,
	})),
	currentUserId: PropTypes.string.isRequired,
};
export default class VideoList extends React.Component {
	callersHash = '';

	shouldComponentUpdate(nextProps) {
		let hash = '';
		VideoList.sortCallers(nextProps.callers).forEach(caller => { // eslint-disable-line no-nested-ternary
			hash += '-' + caller.id + (caller.stream ? '1' : '0');
		});

		const shouldUpdate = hash !== this.callersHash;
		this.callersHash = hash;
		return shouldUpdate;
	}

	componentDidUpdate() {
		this.props.callers.forEach(caller => {
			const video = document.getElementById('video-' + caller.id);
			video.srcObject = caller.stream;
		});
	}

	/**
	 * Sorts the array of callers, making sure the focussed caller is listed first
	 * @param {Array} callers
	 * @return {Array} Sorted array of callers
	 */
	static sortCallers(callers) {
		return [...callers].sort((a, b) => (a.focus ? -1 : (b.focus ? 1 : 0))); // eslint-disable-line no-nested-ternary
	}

	render() {
		let buttons = '';
		if ( this.props.callers.length ) {
			buttons = (
				<div className='kwm-call-buttons'>
					<HangupCallButton onClick={this.props.onHangUp} />
				</div>
			);
		}

		return (
			<div className='kwm-videolist'>
				{VideoList.sortCallers(this.props.callers).map(caller => {
					const videoAttrs = {
						id: 'video-' + caller.id,
						autoPlay: true,
						muted: caller.id === this.props.currentUserId,
					};

					return (
						<div className='kwm-video-container' key={caller.id}>
							<video className='kwm-video' {...videoAttrs} />
							<div className='kwm-video-title'>{caller.displayName}</div>
						</div>
					);
				})}
				{buttons}
			</div>
		);
	}
}
VideoList.propTypes = propTypes;
