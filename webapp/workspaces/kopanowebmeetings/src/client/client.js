import axios from 'axios';

import {delay} from 'utils/utils';

const KWM_PLUGIN_BASE_URI = '/plugins/kopanowebmeetings';
const KWM_PLUGIN_CONFIG_ENDPOINT = '/api/v1/config';

const maxDelay = 20000;
const maxRetryCount = 100;
const retryDelay = 500;
let retryCount = 0;

class Client {
	async fetchConfig() { // eslint-disable-line class-methods-use-this
		return axios.get(KWM_PLUGIN_BASE_URI + KWM_PLUGIN_CONFIG_ENDPOINT).then(response => {
			return response.data;
		});
	}

	// Recursive function to retry upon failure
	fetchConfigWithRetry = async (reset = false) => {
		if ( reset ) {
			retryCount = 0;
		}

		try {
			const config = await this.fetchConfig();
			return config;
		} catch (err) {
			retryCount++;
			if (retryCount >= maxRetryCount) {
				console.error('failed to get KWM config: ' + err);
				throw null;
			}

			console.warn('failed to get KWM config - retrying ' + retryCount, err);
			let t = retryCount * retryDelay;
			if ( t > maxDelay ) {
				t = maxDelay;
			}
			await delay(t);
			return this.fetchConfigWithRetry();
		}
	}
}

export default new Client();
