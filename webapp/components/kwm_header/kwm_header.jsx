import React from 'react';
import PropTypes from 'prop-types';

const KwmHeader = props => (
	<div className='sidebar--right__header'>
		<span className='sidebar--right__title'>{props.title}</span>
		<div className='pull-right'>
			<button
				type='button'
				className='sidebar--right__close'
				aria-label='Close'
				title='Close'
				onClick={props.onClose}
			>
				<i className='fa fa-sign-out' />
			</button>
		</div>
	</div>
);
KwmHeader.propTypes = {
	title: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default KwmHeader;
