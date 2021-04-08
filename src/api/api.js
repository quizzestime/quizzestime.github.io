// import { setUserNav } from '../app.js';
// import page from '../../node_modules/page/page.mjs';
import { setUserData, clearUserData, getUserData } from '../util.js';

export const settings = { host: '', appId: '', apiKey: '' };

export async function get(url) {
	return await request(url, getOptions());
}

export async function del(url) {
	return await request(url, getOptions('delete'));
}

export async function put(url, data) {
	return await request(url, getOptions('put', data));
}

export async function post(url, data) {
	return await request(url, getOptions('post', data));
}

export async function logout() {
	const response = post(settings.host + '/logout', {});
	clearUserData();
	return response;
}

export async function login(username, password) {
	const result = await post(settings.host + '/login', { username, password });
	setUserData({ userId: result.objectId, username, sessionToken: result.sessionToken });
	return result;
}

export async function register(email, username, password) {
	const response = await post(settings.host + '/users', { email, password, username });
	setUserData({ username, userId: response.objectId, sessionToken: response.sessionToken });
	return response;
}

function getOptions(method = 'get', body) {
	const options = {
		method,
		headers: {
			'X-Parse-Application-Id': settings.appId,
			'X-Parse-REST-API-Key': settings.apiKey,
		},
	};

	const auth = getUserData();
	if (auth) {
		options.headers['X-Parse-Session-Token'] = auth.sessionToken;
	}

	if (body) {
		options.headers['Content-Type'] = 'application/json';
		options.body = JSON.stringify(body);
	}

	return options;
}

async function request(url, options) {
	try {
		const response = await fetch(url, options);

		if (response.ok === false) {
			const err = await response.json();
			throw new Error(err.message);
		}

		try {
			// logout return empty body and the server still returns content type as 'application/json'
			// so I can't check if content type is present therefor that's the way I'm handling it with
			// a extra try catch block
			return await response.json();
		} catch (err) {
			return response;
		}
	} catch (err) {
		// HANDLE ERROR WITH THIS SERVER!
		// if (err.message === "Login or password don't match") {
		//     throw err;
		// }

		// if (err.message === 'A user with the same email already exists') {
		//     throw err;
		// }

		// if (err.message === 'Invalid access token') {
		//     sessionStorage.removeItem('auth');

		//     alert(err.message + '!');
		//     setUserNav();
		//     page.redirect('/');
		//     throw err;
		// }

		alert(err);
		throw err;
	}
}
