import React from 'react';
import PropTypes from 'prop-types';

import icons from '../icons';
import './CallTimer.css';

const CallTimerPropTypes = {
	startTime: PropTypes.number.isRequired,
	color: PropTypes.string,
};
const CallTimerDefaultProps = {
	color: '#2389d8',
};
class CallTimer extends React.Component {
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

	static getTimerText(time) {
		/* eslint-disable no-magic-numbers */
		const durationSeconds = Math.floor(time / 1000);
		const seconds = durationSeconds % 60;
		const minutes = ((durationSeconds - seconds) / 60) % 60;
		const hours = (((durationSeconds - seconds) / 60) - minutes) / 60;
		let durationText = String(seconds);
		if ( seconds < 10 ) {
			durationText = '0' + durationText;
		}
		durationText = minutes + ':' + durationText;
		if ( minutes < 10 ) {
			durationText = '0' + durationText;
		}
		if ( hours > 0 ) {
			durationText = hours + ':' + durationText;
		}

		return durationText;
		/* eslint-enable no-magic-numbers */
	}

	render() {
		const cameraIcon = icons.cameraOutlined(this.props.color);
		const styles = {
			color: this.props.color,
		};

		return (
			<div className='call-timer' style={styles}>
				{cameraIcon}
				{CallTimer.getTimerText(this.state.duration)}
			</div>
		);
	}
}
CallTimer.propTypes = CallTimerPropTypes;
CallTimer.defaultProps = CallTimerDefaultProps;

export default CallTimer;
