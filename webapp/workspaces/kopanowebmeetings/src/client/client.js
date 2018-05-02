import axios from 'axios';

const KWM_PLUGIN_BASE_URI = '/plugins/kopanowebmeetings';
const KWM_PLUGIN_CONFIG_ENDPOINT = '/api/v1/config';

class Client {
	async getConfig() { // eslint-disable-line class-methods-use-this
		return axios.get(KWM_PLUGIN_BASE_URI + KWM_PLUGIN_CONFIG_ENDPOINT).then(response => {
			return response.data;
		});
	}
}

export default new Client();
