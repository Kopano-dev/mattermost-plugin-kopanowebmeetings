import React from 'react';
import PropTypes from 'prop-types';

import icons from 'utils/icons';
import './kwm_call_timer.css';

class KwmCallTimer extends React.Component {
	constructor(props) {
		super(props);

		this.updateTime = this.updateTime.bind(this);

		// Start the timer
		const intervalTime = 1000;
		this.intervalId = setInterval(this.updateTime, intervalTime);
		this.state = {
			duration: 0,
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return Math.round(nextState.duration / 1000) !== Math.round(this.state.duration / 1000); // eslint-disable-line no-magic-numbers
	}

	updateTime() {
		this.setState({
			duration: new Date().getTime() - this.props.startTime,
		});
	}

	componentWillUnmount() {
		clearInterval(this.intervalId);
	}

	render() {
		const cameraIcon = icons.cameraOutlined(this.props.color);
		const styles = {
			color: this.props.color,
		};

		const durationSeconds = Math.floor(this.state.duration / 1000); // eslint-disable-line no-magic-numbers
		const seconds = durationSeconds % 60; // eslint-disable-line no-magic-numbers
		const minutes = ((durationSeconds - seconds) / 60) % 60; // eslint-disable-line no-magic-numbers
		const hours = (((durationSeconds - seconds) / 60) - minutes) / 60; // eslint-disable-line no-magic-numbers
		let durationText = String(seconds);
		if ( seconds < 10 ) { // eslint-disable-line no-magic-numbers
			durationText = '0' + durationText;
		}
		durationText = minutes + ':' + durationText;
		if ( minutes < 10 ) { // eslint-disable-line no-magic-numbers
			durationText = '0' + durationText;
		}
		if ( hours > 0 ) {
			durationText = hours + ':' + durationText;
		}

		return (
			<div className='call-timer' style={styles}>
				{cameraIcon}
				{durationText}
			</div>
		);
	}
}
KwmCallTimer.propTypes = {
	startTime: PropTypes.number.isRequired,
	color: PropTypes.string,
};
KwmCallTimer.defaultProps = {
	color: '#2389d8',
};

export default KwmCallTimer;
