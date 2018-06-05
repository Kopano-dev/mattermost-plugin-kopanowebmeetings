import React from 'react';
import PropTypes from 'prop-types';

import './VideoList.css';

const propTypes = {
	callers: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		displayName: PropTypes.string.isRequired,
		stream: PropTypes.object,
		focus: PropTypes.bool,
	})),
	currentUserId: PropTypes.string.isRequired,
	onVideoClick: PropTypes.func,
};
const defaultProps = {
	callers: [],
};
export default class VideoList extends React.Component {
	constructor(props) {
		super(props);
		this.callersHash = '';
	}

	componentDidMount() {
		this.addStreamsToVideoElements();
	}

	shouldComponentUpdate(nextProps) {
		let hash = '';
		VideoList.sortCallers(nextProps.callers, nextProps.currentUserId).forEach(caller => {
			hash += '-' + caller.id + ':' + (caller.stream ? '1' : '0') + ':' + (caller.focus ? '1' : '0');
		});

		const shouldUpdate = hash !== this.callersHash;
		this.callersHash = hash;
		return shouldUpdate;
	}

	componentDidUpdate() {
		this.addStreamsToVideoElements();
	}

	addStreamsToVideoElements() {
		this.props.callers.forEach(caller => {
			const video = document.getElementById('video-' + caller.id);
			video.srcObject = caller.stream;
		});
	}

	/**
	 * Sorts the array of callers, making sure the current user is listed first
	 * @param {Array} callers
	 * @return {Array} Sorted array of callers
	 */
	static sortCallers(callers, currentUserId) {
		return [...callers].sort((a, b) => (a.id === currentUserId ? -1 : (b.id === currentUserId ? 1 : 0))); // eslint-disable-line no-nested-ternary
	}

	render() {
		return (
			<div className='k-videolist-container'>
				<div className='kwm-videolist'>
					{VideoList.sortCallers(this.props.callers, this.props.currentUserId).map(caller => {
						const videoAttrs = {
							id: 'video-' + caller.id,
							autoPlay: true,
							muted: caller.id === this.props.currentUserId,
						};
						if ( this.props.onVideoClick ) {
							videoAttrs.onClick = e => this.props.onVideoClick(caller, e);
						}
						const displayName = caller.id === this.props.currentUserId ? 'You' : caller.displayName;

						return (
							<div className='kwm-video-container' key={caller.id} data-self={caller.id === this.props.currentUserId} data-focus={caller.focus}>
								<video className='kwm-video' {...videoAttrs} />
								<div className='kwm-video-title'>{displayName}</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}
VideoList.propTypes = propTypes;
VideoList.defaultProps = defaultProps;
