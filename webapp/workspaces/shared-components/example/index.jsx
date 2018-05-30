import React from 'react';
import ReactDOM from 'react-dom';

import CallTimer from 'mattermost-plugin-kopanowebmeetings/webapp/workspaces/shared-components/src/CallTimer';

ReactDOM.render(
	<div>
		<h1>My example app</h1>
		<CallTimer startTime={new Date().getTime()} />
	</div>,
	document.getElementById('app')
);