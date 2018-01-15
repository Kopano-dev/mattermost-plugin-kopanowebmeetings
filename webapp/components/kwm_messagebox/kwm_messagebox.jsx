import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Modal} from 'react-bootstrap';

import {handleError} from 'actions/kwm_actions.js';

class KwmMessagebox extends React.PureComponent {
	render() {
		if (!this.props.show) {
			return null;
		}

		return (
			<Modal.Dialog show={this.props.show}>
				<Modal.Header closeButton={true} onHide={this.props.handleError}>
					<Modal.Title>{'Kopano Web Meetings'}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{this.props.message}
				</Modal.Body>
			</Modal.Dialog>
		);
	}
}
KwmMessagebox.propTypes = {
	show: PropTypes.bool.isRequired,
	handleError: PropTypes.func.isRequired,
	message: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
	show: state.error !== null,
	message: state.error ? state.error.message : '',
});

const mapDispatchToProps = dispatch => bindActionCreators({
	handleError,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(KwmMessagebox);
