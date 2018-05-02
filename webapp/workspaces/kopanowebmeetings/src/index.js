import KwmPlugin from 'components/kwm_plugin.jsx';

class PluginClass {
	initialize(registerComponents, store) { // eslint-disable-line class-methods-use-this
		// HACK ALERT: we will pass our plugin component as ChannelHeaderButton
		// This way we can wrap all the components we need with the KwmPlugin component.
		registerComponents({
			ChannelHeaderButton: KwmPlugin,
		});
	}
}

window.plugins['kopanowebmeetings'] = new PluginClass();
