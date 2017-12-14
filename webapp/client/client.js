import axios from 'axios';

const KWM_PLUGIN_BASE_URI = '/plugins/kopanowebmeetings';
const KWM_PLUGIN_CONFIG_ENDPOINT = '/api/v1/config';

class Client {
/* eslint-disable class-methods-use-this */
	async getConfig() {
		let config;
		try {
			config = await axios.get(KWM_PLUGIN_BASE_URI + KWM_PLUGIN_CONFIG_ENDPOINT);
		} catch (err) {
			console.error('Error fetching configuration:', err);
			return null;
		}

		return config.data;
	}
/* eslint-enable class-methods-use-this */
}

export default new Client();
