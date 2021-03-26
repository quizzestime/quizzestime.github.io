// import { setUserNav } from '../app.js';
import page from '../../node_modules/page/page.mjs';

export const settings = { host: '' };

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
    const result = await post(settings.host + '/logout', {});
    sessionStorage.removeItem('auth');
    return result;
}

export async function login(username, password) {
    const result = await post(settings.host + '/login', { username, password });
    sessionStorage.setItem('auth', JSON.stringify({ userId: result.objectId, username, sessionToken: result.sessionToken }));
    return result;
}

export async function register(email, username, password) {
    const result = await post(settings.host + '/users', { email, password, username });
    const { objectId, sessionToken } = result;
    sessionStorage.setItem('auth', JSON.stringify({ email, userId: objectId, username, sessionToken }));
    return result;
}

function getOptions(method = 'get', body) {
    const options = {
        method,
        headers: {
            'X-Parse-Application-Id': 'rX9pQotyb61uGjaDLaKiWUwMIjJPdoHXQrOeqelD',
            'X-Parse-REST-API-Key': 'ZwirWXx717fdEEuoQ2J8bSRS0Uu8DZwCpoUU0LlL',
        },
    };

    const auth = sessionStorage.getItem('auth');
    if (auth != null) {
        options.headers['X-Parse-Session-Token'] = JSON.parse(auth).sessionToken;
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
    } catch (err) {  // HANDLE ERROR WITH THIS SERVER!
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
