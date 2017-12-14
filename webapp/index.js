import KwmPlugin from 'components/kwm_plugin.jsx';

class PluginClass {
	/* eslint-disable class-methods-use-this */
	initialize(registerComponents, store) {
		// HACK ALERT: we will pass our plugin component as ChannelHeaderButton
		// This way we can wrap all the components we need with the KwmPlugin component.
		registerComponents({
			ChannelHeaderButton: KwmPlugin,
		});
	}
	/* eslint-enable class-methods-use-this */
}

/* eslint-disable no-undef */
global.window.plugins['kopanowebmeetings'] = new PluginClass();
/* eslint-enable no-undef */
