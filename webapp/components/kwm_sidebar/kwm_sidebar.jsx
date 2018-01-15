import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import './kwm_sidebar.css';

import {closeKwmSidebar} from 'actions/kwm_actions.js';
import KwmHeader from 'components/kwm_header/kwm_header.jsx';
import {removeClassFromElement, addClassToElement} from 'utils/utils.js';

class KwmSidebar extends React.Component {
	render() {
		const show = () => {
			removeClassFromElement('.app__body .inner-wrap', 'move--right');
			addClassToElement('.app__body .inner-wrap', ['webrtc--show', 'move--left']);
			removeClassFromElement('.app__body .sidebar--left', 'move--right');
			removeClassFromElement('.multi-teams .team-sidebar', 'move--right');
			addClassToElement('.app__body .webrtc', 'webrtc--show');
		};

		const hide = () => {
			removeClassFromElement('.app__body .inner-wrap', ['webrtc--show', 'move--left', 'move--right']);
			removeClassFromElement('.app__body .webrtc', 'webrtc--show');
		};

		const {isOpen} = this.props;

		if ( !isOpen ) {
			hide();
			return <div />;
		}

		show();

		return (
			<div className='sidebar--right webrtc' id='sidebar-webrtc'>
				<div className='sidebar--right__bg' />
				<div className='sidebar-right-container'>
					<div className='sidebar--right__content'>
						<div className='search-bar__container channel-header alt' />
						<div className='sidebar-right__body'>
							<KwmHeader onClose={this.props.onClose} title={this.props.title} />
							{this.props.children}
						</div>
					</div>
				</div>
			</div>
		);
	}
}
KwmSidebar.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.object),
		PropTypes.object,
	]),
};

const mapStateToProps = state => ({
	isOpen: state.kwmSidebar.open,
	remoteUsers: state.remoteUsers || [],
});

const mapDispatchToProps = dispatch => bindActionCreators({
	closeKwmSidebar,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(KwmSidebar);
