import * as KWM from 'kwmjs';

export let kwm = null;

export const init = config => {
	if ( config === null ) {
		throw new Error('No config available to create a KWM object');
	}
	if ( !config.kwmserver_url || !config.token ) {
		throw new Error('No KWM server URL or token in KWM config');
	}

	const options = {
		authorizationType: config.token.type,
		authorizationValue: config.token.value,
	};
	kwm = new KWM(config.kwmserver_url, options);

	// Remove all potential defaults.
	kwm.webrtc.config = {};
};
