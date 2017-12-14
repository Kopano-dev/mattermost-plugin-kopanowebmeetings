import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import './kwm_videolist.css';
import {KwmHangUpButton} from 'components/kwm_buttons/kwm_buttons.jsx';
import {getDisplayName} from 'utils/utils.js';

class KwmVideoList extends React.Component {
	callersHash: ''

	shouldComponentUpdate(nextProps) {
		let hash = '';
		/* eslint-disable no-nested-ternary */
		nextProps.callers.sort((a, b) => (a.focus ? -1 : (b.focus ? 1 : 0))).forEach(caller => {
			hash += '-' + caller.user.id + (caller.stream ? '1' : '0');
		});
		/* eslint-enable no-nested-ternary */

		const shouldUpdate = hash !== this.callersHash;
		this.callersHash = hash;
		return shouldUpdate;
	}

	componentDidUpdate() {
		this.props.callers.forEach(caller => {
			const video = document.getElementById('video-' + caller.user.id);
			video.srcObject = caller.stream;
		});
	}

	render() {
		const onHangUp = this.props.onHangUp || (() => console.error('Hangup not implemented'));

		let buttons = '';
		if ( this.props.callers.length ) {
			buttons = (
				<div className='kwm-call-buttons'>
					<KwmHangUpButton onHangUp={onHangUp} />
				</div>
			);
		}
		/* eslint-disable no-nested-ternary */
		return (
			<div className='kwm-videolist'>
				{this.props.callers.sort((a, b) => (a.focus ? -1 : (b.focus ? 1 : 0))).map(caller => {
					const videoProps = {
						id: 'video-' + caller.user.id,
						autoPlay: true,
						muted: false,
					};

					return (
						<div className='kwm-video-container' key={caller.user.id}>
							<video className='kwm-video' {...videoProps} />
							<div className='kwm-video-title'>{getDisplayName(caller.user)}</div>
						</div>
					);
				})}
				{buttons}
			</div>
		);
		/* eslint-enable no-nested-ternary */
	}
}
KwmVideoList.propTypes = {
	onHangUp: PropTypes.func,
	callers: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = state => ({
	callers: state.callers,
});

export default connect(mapStateToProps)(KwmVideoList);
