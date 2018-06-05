import React from 'react';
import PropTypes from 'prop-types';

import {HangupCallButton} from '@kopanowebmeetings/shared-components/src/buttons';

const propTypes = {
	// The event handler for the click event of the hangup button.
	// If not specified, the button will not be shown.
	onHangUp: PropTypes.func,
};

const ActiveCallButtons = props => (
	<div className='k-buttons-activecall'>
		{props.onHangUp ? <HangupCallButton onClick={props.onHangUp} /> : null}
	</div>
);
ActiveCallButtons.propTypes = propTypes;

export default ActiveCallButtons;