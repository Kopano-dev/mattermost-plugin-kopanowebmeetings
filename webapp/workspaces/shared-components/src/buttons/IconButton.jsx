import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Factory function to create buttons that only have an SVG icon as content
 *
 * @param {ReactElement|Object} icon SVG icon or a object with icons connected to
 * classes. The default icon is set with the key 'default'. E.g.:
 * {
 *		default: defaultIcon,
 *		active: activeIcon,
 * }
 * When the component has the className 'active' set, the activeIcon will be used,
 * otherwise the defaultIcon will be used.
 * @return {React.Component} The button component. It processes the properties
 * className and onClick. Other attributes (e.g. disabled) can be passed in the
 * property attrs.
 */
const createIconButton = (icon, classes) => {
	function Btn(props) {
		const className = classNames('kwm-btn', 'kwm-icon-btn', classes, props.className);

		let iconObj = icon;
		if ( React.isValidElement(icon) ) {
			iconObj = {
				default: icon,
			};
		}
		// Find the correct icon
		const classList = className.split(' ');
		let iconString = iconObj.default;
		for ( const k in iconObj ) {
			if ( classList.some(c => k === c) ) {
				iconString = iconObj[k];
			}
		}

		return (
			<button className={className} {...props.attrs} onClick={props.onClick}>
				{iconString}
			</button>
		);
	}
	Btn.propTypes = {
		className: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.arrayOf(PropTypes.string),
		]),
		attrs: PropTypes.object,
		onClick: PropTypes.func,
	};
	Btn.defaultProps = {
		className: '',
		onClick: () => console.warn('Click handler not defined!'),
		attrs: {},
	};

	return Btn;
};

export default createIconButton;