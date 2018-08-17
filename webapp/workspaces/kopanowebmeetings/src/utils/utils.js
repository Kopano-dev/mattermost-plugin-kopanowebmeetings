import {Client4} from 'mattermost-redux/client';
import {getCurrentUser, getUser} from 'mattermost-redux/selectors/entities/users';
import {getCurrentChannel} from 'mattermost-redux/selectors/entities/channels';

import Constants from './constants';
import client from 'client/client.js';

export const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));

export const getConfig = async () => {
	let config;
	try {
		config = await client.fetchConfigWithRetry(true);
	} catch (err) {
		// Failed to get the config. Schedule a retry after 30 seconds
		//console.log('retrying after 30 seconds');
		//setTimeout(() => getConfig(), 30000);

		return null;
	}

	console.log('config fetched', config);
	if ( config ) {
		// Build ICE servers from values in config.
		const iceServers = [
		];
		if (config.stun_uri) {
			iceServers.push({
				urls: config.stun_uri.split(' '),
			});
		}
		if (config.turn_uri) {
			const s = {
				urls: config.turn_uri.split(' '),
			};
			if (config.turn_username) {
				s.username = config.turn_username;
			}
			if (config.turn_password) {
				s.credential = config.turn_password;
			}
			iceServers.push(s);
		}

		// Update KWM WebRTC config.
		config.iceServers = iceServers;

		//console.log('dispatching config update', config);
		//dispatch(setConfig(config));
		//await dispatch(createKwmObj());
		//await dispatch(connectToKwmServer());

		// Schedule a refresh
		// TODO(longsleep): Check behavior when laptop was asleep / or when clock changes.
		//const when = 0.9 * config.expires_in * 1000; // eslint-disable-line no-magic-numbers
		//console.log('setting refresh timeout at ', when);
		//setTimeout(() => getConfig(), when);

		return config;
	}
};

/**
 * Returns a name based on the first_name and last_name properties of the given user.
 * Note: Copied from Mattermost utils.jsx
 * @param  {Object} user The user who's full name will be returned
 * @return {String} The users full name
 */
export function getFullName(user) {
	if (user.first_name && user.last_name) {
		return user.first_name + ' ' + user.last_name;
	} else if (user.first_name) {
		return user.first_name;
	} else if (user.last_name) {
		return user.last_name;
	}

	return '';
}

/**
 * Returns the display name (i.e. nickname or full name) of the user.
 * Note: Copied from Mattermost utils.jsx
 * @param  {Object} user The user who's display name will be returned
 * @return {String} The users display name
 */
export function getDisplayName(user) {
	if (user.nickname && user.nickname.trim().length > 0) {
		return user.nickname;
	}
	var fullName = getFullName(user);

	if (fullName) {
		return fullName;
	}

	return user.username;
}

/**
 * Creates the url of the profile image of the given user
 * Note: Copied from Mattermost utils.jsx (and adjusted a little)
 * @param  {String|Object} userIdOrObject Either the id of the user or his profile.
 * @return {String} The url of the profile image of the given user.
 */
export function imageURLForUser(userIdOrObject) {
	if (typeof userIdOrObject == 'string') {
		return Client4.getUsersRoute() + '/' + userIdOrObject + '/image?_=0';
	}
	return Client4.getUsersRoute() + '/' + userIdOrObject.id + '/image?_=' + (userIdOrObject.last_picture_update || 0);
}

/**
 * Removes classes from an html element
 * @param  {String} elementSelector The css selector to get the html element(s)
 * @param  {String[]|String} classNames The class(es) that should be removed from the element(s)
 */
export const removeClassFromElement = (elementSelector, classNames) => {
	const els = document.querySelectorAll(elementSelector);
	if ( els.length === 0 ) {
		return;
	}

	if ( !Array.isArray(classNames) ) {
		/* eslint-disable no-param-reassign */
		classNames = [classNames];
		/* eslint-enable no-param-reassign */
	}

	classNames.forEach(className => {
		// IE, Edge do not support forEach on a nodeList, so we must use this
		// old fashioned for loop.
		for (let i = 0; i < els.length; i++) {
			els[i].classList.remove(className);
		}
	});
};

/**
 * Adds classes to an html element
 * @param  {String} elementSelector The css selector to get the html element(s)
 * @param  {String[]|String} classNames The class(es) that should be added to the element(s)
 */
export const addClassToElement = (elementSelector, classNames) => {
	const els = document.querySelectorAll(elementSelector);
	if ( els.length === 0 ) {
		return;
	}

	if ( !Array.isArray(classNames) ) {
		/* eslint-disable no-param-reassign */
		classNames = [classNames];
		/* eslint-enable no-param-reassign */
	}

	classNames.forEach(className => {
		// IE, Edge do not support forEach on a nodeList, so we must use this
		// old fashioned for loop.
		for (let i = 0; i < els.length; i++) {
			els[i].classList.add(className);
		}
	});
};

/**
 * Returns the profile of the other user when the current channel is a
 * 'direct message' channel.
 * If the current channel is not a direct message channel, or no other
 * user is found the return value will be null.
 * NOTE(rtoussaint): The function name seems a bit confusing but is copied from
 * Mattermost.
 * @param {Object} mmState The mattermost-redux state
 * @return {Object} the profile of the other user if the current
 * channel is a direct channel, null otherwise.
 */
export function getDirectTeammate(mmState) {
	const channel = getCurrentChannel(mmState);
	if ( !channel || channel.type !== Constants.DM_CHANNEL ) {
		return null;
	}

	const userIds = channel.name.split('__');
	const curUser = getCurrentUser(mmState);

	if ( userIds.length !== 2 || userIds.indexOf(curUser.id) === -1 ) {
		return null;
	}

	if ( userIds[0] === curUser.id ) {
		return getUser(mmState, userIds[1]);
	}

	return getUser(mmState, userIds[0]);
}
