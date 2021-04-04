import { page, render } from './lib.js';
import { createCubeLoader } from './views/common/loader.js';
import { logout, getQuizzes, getQuestionsByQuizId } from './api/data.js';

import homePage from './views/home.js';
import browsePage from './views/browse.js';
import quizPage from './views/quiz/quiz.js';
import profilePage from './views/profile.js';
import detailsPage from './views/details.js';
import editorPage from './views/editor/editor.js';
import summaryPage from './views/quiz/summary.js';
import { loginPage, registerPage } from './views/auth.js';

page('/', decorateContext, homePage);
page('/login', decorateContext, loginPage);
page('/create', decorateContext, editorPage);
page('/browse', decorateContext, browsePage);
page('/profile', decorateContext, profilePage);
page('/edit/:id', decorateContext, editorPage);
page('/register', decorateContext, registerPage);
page('/details/:id', decorateContext, detailsPage);
page('/quiz/:id', decorateContext, getQuiz, quizPage);
page('/summary/:id', decorateContext, getQuiz, summaryPage);

const main = document.getElementById('content');

setUserNav();
const state = {};
page.start();

function decorateContext(ctx, next) {
	ctx.render = (content) => render(content, main);
	ctx.setUserNav = setUserNav;
	next();
}

async function getQuiz(ctx, next) {
	ctx.clearState = clearState;
	const quizId = ctx.params.id;
	if (state[quizId] == undefined) {
		ctx.render(createCubeLoader());
		state[quizId] = await getQuizzes(quizId);
		const ownerId = state[quizId].owner.objectId;
		state[quizId].questions = await getQuestionsByQuizId(quizId, ownerId);
		state[quizId].answers = state[quizId].questions.map((q) => undefined);
	}
	ctx.quiz = state[quizId];
	next();
}

function clearState(quizId) {
	if (quizId) delete state[quizId];
}

document.getElementById('logoutBtn').addEventListener('click', async () => {
	await logout();
	setUserNav();
	page.redirect('/');
});

function setUserNav() {
	if (sessionStorage.getItem('auth')) {
		document.getElementById('guest-nav').style.display = 'none';
		document.getElementById('user-nav').style.display = 'block';
	} else {
		document.getElementById('user-nav').style.display = 'none';
		document.getElementById('guest-nav').style.display = 'block';
	}
}
