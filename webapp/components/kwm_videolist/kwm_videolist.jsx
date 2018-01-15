import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import * as Selectors from 'mattermost-redux/selectors/entities/users';

import './kwm_videolist.css';
import {KwmHangUpButton} from 'components/kwm_buttons/kwm_buttons.jsx';
import {getDisplayName} from 'utils/utils.js';

class KwmVideoList extends React.Component {
	callersHash: ''

	shouldComponentUpdate(nextProps) {
		let hash = '';
		nextProps.callers.sort((a, b) => (a.focus ? -1 : (b.focus ? 1 : 0))).forEach(caller => { // eslint-disable-line no-nested-ternary
			hash += '-' + caller.user.id + (caller.stream ? '1' : '0');
		});

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
		const {getCurrentUserId} = this.props;
		const onHangUp = this.props.onHangUp || (() => console.error('Hangup not implemented'));

		let buttons = '';
		if ( this.props.callers.length ) {
			buttons = (
				<div className='kwm-call-buttons'>
					<KwmHangUpButton onHangUp={onHangUp} />
				</div>
			);
		}

		const currentUserId = getCurrentUserId();

		return (
			<div className='kwm-videolist'>
				{this.props.callers.sort((a, b) => (a.focus ? -1 : (b.focus ? 1 : 0))).map(caller => { // eslint-disable-line no-nested-ternary
					const videoProps = {
						id: 'video-' + caller.user.id,
						autoPlay: true,
						muted: caller.user.id === currentUserId,
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
	}
}
KwmVideoList.propTypes = {
	onHangUp: PropTypes.func,
	callers: PropTypes.arrayOf(PropTypes.object),
	getCurrentUserId: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	callers: state.callers,
	getCurrentUserId: () => Selectors.getCurrentUserId(state.mattermostReduxState),
});

export default connect(mapStateToProps)(KwmVideoList);
