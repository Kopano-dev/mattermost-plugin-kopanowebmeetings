import React from 'react';
import PropTypes from 'prop-types';

import {Modal} from 'react-bootstrap';

const propTypes = {
	show: PropTypes.bool.isRequired,
	message: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired,
};
export default class Messagebox extends React.PureComponent {
	render() {
		if (!this.props.show) {
			return null;
		}

		return (
			<Modal.Dialog>
				<Modal.Header closeButton={true} onHide={this.props.onClose}>
					<Modal.Title>{'Kopano Web Meetings'}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{this.props.message}
				</Modal.Body>
			</Modal.Dialog>
		);
	}
}
Messagebox.propTypes = propTypes;
