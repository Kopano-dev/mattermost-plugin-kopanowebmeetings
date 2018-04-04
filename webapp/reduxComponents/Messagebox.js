import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {handleError} from 'actions/kwm_actions.js';

// Original component
import Messagebox from 'components/Messagebox';

const mapStateToProps = state => ({
	show: state.error !== null,
	message: state.error ? state.error.message : '',
});

const mapDispatchToProps = dispatch => bindActionCreators({
	onClose: handleError,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Messagebox);
