/*
 * This is a "fake" component. It doesn't render anything,
 * but is used to update the button that mattermost created
 * for us in the header.
 */

import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	disabled: PropTypes.bool.isRequired,
	active: PropTypes.bool.isRequired,
};
export default class HeaderButton extends React.PureComponent {
	//HACK ALERT: We will abuse this function to to update the
	// button in the header. We must do this because the button is not
	// one of our components, but rather a component created by Mattermost
	// with out input (icon and click handler)
	// This component will not render anything itself
	render() { //eslint-disable-line class-methods-use-this
		const {disabled, active} = this.props;
		const el = document.querySelector('#channel-header .kwm-start-btn');

		if ( el && active ) {
			el.parentNode.classList.add('active');
		} else {
			el.parentNode.classList.remove('active');
		}
		if ( el && disabled ) {
			el.parentNode.setAttribute('disabled', 'true');
		} else {
			el.parentNode.removeAttribute('disabled');
		}

		return '';
	}
}
HeaderButton.propTypes = propTypes;
