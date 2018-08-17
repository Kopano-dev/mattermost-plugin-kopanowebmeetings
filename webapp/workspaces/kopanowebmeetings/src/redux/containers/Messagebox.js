import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {actions, selectors} from 'redux/ducks';
const {handleError} = actions;
const {hasError, getErrorMessage} = selectors;

// Original component
import Messagebox from 'components/Messagebox';

const mapStateToProps = state => ({
	show: hasError(state['plugins-kopanowebmeetings']),
	message: getErrorMessage(state['plugins-kopanowebmeetings']),
});

const mapDispatchToProps = dispatch => bindActionCreators({
	onClose: handleError,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Messagebox);
