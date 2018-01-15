import axios from 'axios';

const KWM_PLUGIN_BASE_URI = '/plugins/kopanowebmeetings';
const KWM_PLUGIN_CONFIG_ENDPOINT = '/api/v1/config';

class Client {
/* eslint-disable class-methods-use-this */
	async getConfig() {
		return axios.get(KWM_PLUGIN_BASE_URI + KWM_PLUGIN_CONFIG_ENDPOINT).then(response => {
			return response.data;
		});
	}
/* eslint-enable class-methods-use-this */
}

export default new Client();
