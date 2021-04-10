import { html, until } from '../lib.js';
import { getUserData } from '../util.js';
import { cubeLoader } from './common/loader.js';
import { getSolutionsByUserId, getQuizzesByUserId, getQuizByQuizId, getSolutionsCount, deleteQuiz } from '../api/data.js';

// Static content
const template = ({ email, username }, userLastSolution, userLastCompleteQuiz, quizzesCreatedByUser, quizTakenTimes, onEdit, onDelete) => html`
    <section id="profile">
        <div class="hero pad-large">
            <article class="glass pad-large profile">
                <h2>Profile Details</h2>
                <p>
                    <span class="profile-info">Username:</span>
                    ${username}
                </p>
                <p>
                    <span class="profile-info">Email:</span>
                    ${email}
                </p>
                <h2>Your Last Quiz Result</h2>
                <table class="quiz-results">
                    <tbody>
                        ${userLastSolution
                            ? html` <tr class="results-row">
                                  <td class="cell-1">${userLastSolution.date}</td>
                                  <td class="cell-2">
                                      <a href=${'/details/' + userLastCompleteQuiz.objectId}>${userLastCompleteQuiz.title}</a>
                                  </td>
                                  <td class="cell-3 s-correct">${((userLastSolution.correct / userLastSolution.total) * 100).toFixed(2)}%</td>
                                  <td class="cell-4 s-correct">${userLastSolution.correct}/${userLastSolution.total} correct answers</td>
                              </tr>`
                            : html`
                                  <h4>You haven't completed any quizzes yet.</h4>
                                  <br />
                                  <a href="/browse">Browse all quizzes</a>
                              `}
                    </tbody>
                </table>
            </article>
        </div>

        <header class="pad-large">
            <h2>Quizzes created by you</h2>
        </header>

        <div class="pad-large alt-page">
            ${quizzesCreatedByUser
                ? quizzesCreatedByUser.map((q) => quizTemplate(q, quizTakenTimes, onEdit, onDelete))
                : html`
                      <h2>You haven't created any quizzes yet.</h2>
                      <br />
                      <a href="/create">Create one now</a>
                  `}
        </div>
    </section>
`;

const quizTemplate = ({ title, category, questionCount, objectId }, quizTakenTimes, onEdit, onDelete) => html`
    <article class="preview layout">
        <div class="right-col">
            <a class="action cta" href=${'/details/' + objectId}>View Quiz</a>
            <a @click=${onEdit} class="action cta" href="javascript:void(0)"><i class="fas fa-edit"></i></a>
            <a @click=${onDelete} class="action cta" href="javascript:void(0)"><i class="fas fa-trash-alt"></i></a>
        </div>
        <div class="left-col">
            <h3><a class="quiz-title-link" href=${'/details/' + objectId}>${title}</a></h3>
            <br />
            <span class="quiz-topic">Category: ${category}</span>
            <div class="quiz-meta">
                <span>${questionCount} questions</span>
                <span>|</span>
                <span>Taken ${quizTakenTimes[objectId] || 0} times</span>
            </div>
        </div>
    </article>
`;

export default async function userPage(ctx) {
    const quizTakenTimes = {};
    const user = getUserData();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const quizzesCreatedByUser = (await getQuizzesByUserId(user.userId)) || null;
    const userLastSolution = (await getSolutionsByUserId(user.userId)).slice(-1).shift() || null;
    const userLastCompleteQuiz = (await getQuizByQuizId(userLastSolution.quiz.objectId)) || null;

    if (quizzesCreatedByUser) {
        Object.assign(quizTakenTimes, await getSolutionsCount(quizzesCreatedByUser.map((q) => q.objectId)));
    }

    if (userLastSolution) {
        const date = new Date(userLastSolution.createdAt);
        userLastSolution.date = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    }

    update();								// implement loader

    async function onEdit(id) {
        console.log(id);                    // test
    }

    async function onDelete(id) {
        console.log(id);                    // test 
        // await deleteQuiz(id);
        // update();
    }

    async function update() {
        ctx.render(template(user, userLastSolution, userLastCompleteQuiz, quizzesCreatedByUser, quizTakenTimes, onEdit, onDelete));
    }
}
