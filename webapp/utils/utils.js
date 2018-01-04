import {Client4} from 'mattermost-redux/client';

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
