import PropTypes from 'prop-types';

import './buttons.css';
import {cameraOutlined, cameraFilled, pickupPhone, hangupPhone} from '../icons';
import createIconButton from './IconButton';

/**
 * The button that can be used to start calls.
 */
export const StartCallButton = createIconButton(
	{
		default: cameraOutlined(),
		active: cameraFilled(),
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
export const PickupCallButton = createIconButton(pickupPhone(), 'kwm-accept');
PickupCallButton.propTypes = {
	className: PropTypes.string,
	onClick: PropTypes.func,
	attrs: PropTypes.object,
};

/**
 * The button used to hang up or reject a call.
 */
export const HangupCallButton = createIconButton(hangupPhone(), 'kwm-reject');
HangupCallButton.propTypes = {
	className: PropTypes.string,
	onClick: PropTypes.func,
	attrs: PropTypes.object,
};

const Buttons = {
	StartCallButton,
	PickupCallButton,
	HangupCallButton,
};
export default Buttons;
