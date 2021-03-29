import * as api from './api.js';

const host = 'https://parseapi.back4app.com';
api.settings.host = host;

export const login = api.login;
export const logout = api.logout;
export const register = api.register;

// Implement application specific requests
function createPointer(name, id) {
    return { __type: 'Pointer', className: name, objectId: id };
}

function addOwner(object) {
    const userId = JSON.parse(sessionStorage.getItem('auth')).userId;
    const result = Object.assign({}, object);
    result.owner = createPointer('_User', userId);
    return result;
}

// Quiz collection
export async function deleteQuiz(quizId) {
    return api.del(host + '/classes/Quiz/' + quizId);
}

export async function createQuiz(quiz) {
    const body = addOwner(quiz);
    return api.post(host + '/classes/Quiz', body);
}

export async function updateQuiz(quizId, quiz) {
    return api.put(host + '/classes/Quiz/' + quizId, quiz);
}

export async function getQuizzes(quizId) {
    return api.get(host + '/classes/Quiz' + (quizId ? '/'.concat(quizId + '?include=owner') : ''));
}

// Question collection
export async function createQuestion(quizId, question) {
    const body = addOwner(question);
    body.quiz = createPointer('Quiz', quizId);
    return await api.post(host + '/classes/Question', body);
}

export async function deleteQuestion(quizId) {
    return await api.del(host + '/classes/Question/' + quizId);
}

export async function updateQuestion(questionId, question) {
    return await api.put(host + '/classes/Question/' + questionId, question);
}

export async function getQuestionsByQuizId(quizId) {
    const query = JSON.stringify({ quiz: createPointer('Quiz', quizId) });
    const response = await api.get(host + '/classes/Question?where=' + encodeURIComponent(query));
    return response.results;
}
