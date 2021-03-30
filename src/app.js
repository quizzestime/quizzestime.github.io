import homePage from './views/home.js';
import { page, render } from './lib.js';
import browsePage from './views/browse.js';
import editorPage from './views/editor/editor.js';
import { logout as apiLogout } from './api/data.js';
import { loginPage, registerPage } from './views/auth.js';

/////////
import * as api from './api/data.js';
window.api = api; // for dev mode
////////

const main = document.getElementById('content');
document.getElementById('logoutBtn').addEventListener('click', logout);

page('/', decorateContext, homePage);
page('/login', decorateContext, loginPage);
page('/create', decorateContext, editorPage);
page('/browse', decorateContext, browsePage);
page('/edit/:id', decorateContext, editorPage);
page('/register', decorateContext, registerPage);

setUserNav();
page.start();

function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, main); // Partial application
    ctx.setUserNav = setUserNav;
    next();
}

function setUserNav() {
    if (sessionStorage.getItem('auth')) {
        document.getElementById('guest-nav').style.display = 'none';
        document.getElementById('user-nav').style.display = 'block';
    } else {
        document.getElementById('user-nav').style.display = 'none';
        document.getElementById('guest-nav').style.display = 'block';
    }
}

async function logout() {
    await apiLogout();
    setUserNav();
    page.redirect('/');
}
