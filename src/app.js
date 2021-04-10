import userPage from './views/user.js';
import homePage from './views/home.js';
import { getUserData } from './util.js';
import { page, render } from './lib.js';
import browsePage from './views/browse.js';
import quizPage from './views/quiz/quiz.js';
import detailsPage from './views/quiz/details.js';
import editorPage from './views/editor/editor.js';
import summaryPage from './views/quiz/summary.js';
import { cubeLoader } from './views/common/loader.js';
import { loginPage, registerPage } from './views/auth.js';
import { logout, getQuestionsByQuizId, getQuizByQuizId } from './api/data.js';

const main = document.getElementById('content');
const state = {};
setUserNav();

// page('/', homePage);
// page('/login', loginPage);
// page('*', decorateContext);
// page('/browse', browsePage);
// page('/create', editorPage);
// page('/edit/:id', editorPage);
// page('/register', registerPage);
// page('/quiz/:id', getQuiz, quizPage);
// page('/details/:id', getQuiz, detailsPage);
// page('/summary/:id', getQuiz, summaryPage);

page('/', decorateContext, homePage);
page('/login', decorateContext, loginPage);
page('/create', decorateContext, editorPage);
page('/browse', decorateContext, browsePage);
page('/edit/:id', decorateContext, editorPage);
page('/register', decorateContext, registerPage);
page('/users/:id', decorateContext, userPage);
page('/quiz/:id', decorateContext, getQuiz, quizPage);
page('/details/:id', decorateContext, getQuiz, detailsPage);
page('/summary/:id', decorateContext, getQuiz, summaryPage);

page.start();

function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, main);
    ctx.setUserNav = setUserNav;
    ctx.auth = getUserData();
    next();
}

async function getQuiz(ctx, next) {
    ctx.clearState = clearState;
    const quizId = ctx.params.id;
    if (state[quizId] == undefined) {
        ctx.render(cubeLoader());
        state[quizId] = await getQuizByQuizId(quizId);
        const ownerId = state[quizId].owner.objectId;
        state[quizId].questions = await getQuestionsByQuizId(quizId, ownerId);
        state[quizId].answers = state[quizId].questions.map((q) => undefined);
    }
    ctx.quiz = state[quizId];

    next();
}

function clearState(quizId) {
    if (quizId) {
        delete state[quizId];
    }
}

document.getElementById('logoutBtn').addEventListener('click', async () => {
    await logout();
    setUserNav();
    page.redirect('/');
});

export default function setUserNav() {
    const auth = getUserData();
    if (auth) {
        document.getElementById('user-nav').style.display = 'block';
        document.getElementById('guest-nav').style.display = 'none';
        document.querySelector('.profile-link').href = `/users/${auth.userId}`;
    } else {
        document.getElementById('user-nav').style.display = 'none';
        document.getElementById('guest-nav').style.display = 'block';
    }
}
