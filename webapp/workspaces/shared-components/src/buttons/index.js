import PropTypes from 'prop-types';

import './buttons.css';
import {
	CameraOutlined,
	CameraFilled,
	Phone,
	PhoneDown,
	Maximize,
	Minimize,
} from '@kopanowebmeetings/icons/src';

import createIconButton from './IconButton';

/**
 * The button that can be used to start calls.
 */
export const StartCallButton = createIconButton(
	{
		default: CameraOutlined(), // eslint-disable-line new-cap
		active: CameraFilled(), // eslint-disable-line new-cap
	},
	'kwm-start-call'
);
StartCallButton.propTypes = {
	className: PropTypes.string,
	onClick: PropTypes.func,
	attrs: PropTypes.object,
};

/**
 * The button used to pick up a call.
 */
export const PickupCallButton = createIconButton(Phone(), 'kwm-accept'); // eslint-disable-line new-cap
PickupCallButton.propTypes = {
	className: PropTypes.string,
	onClick: PropTypes.func,
	attrs: PropTypes.object,
};

/**
 * The button used to hang up or reject a call.
 */
export const HangupCallButton = createIconButton(PhoneDown(), 'kwm-reject'); // eslint-disable-line new-cap
HangupCallButton.propTypes = {
	className: PropTypes.string,
	onClick: PropTypes.func,
	attrs: PropTypes.object,
};

/**
 * The button to go full screen.
 */
export const OpenFullScreenButton = createIconButton(Maximize(), 'kwm-fullscreen kwm-header'); // eslint-disable-line new-cap
OpenFullScreenButton.propTypes = {
	className: PropTypes.string,
	onClick: PropTypes.func,
	attrs: PropTypes.object,
};

/**
 * The button to close full screen.
 */
export const CloseFullScreenButton = createIconButton(Minimize(), 'kwm-closefullscreen kwm-header'); // eslint-disable-line new-cap
CloseFullScreenButton.propTypes = {
	className: PropTypes.string,
	onClick: PropTypes.func,
	attrs: PropTypes.object,
};

const Buttons = {
	StartCallButton,
	PickupCallButton,
	HangupCallButton,
	OpenFullScreenButton,
	CloseFullScreenButton,
};
export default Buttons;
