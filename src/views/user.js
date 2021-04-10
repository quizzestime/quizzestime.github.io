import { html, until } from '../lib.js';
import { getUserData } from '../util.js';
import { cubeLoader } from './common/loader.js';
import { getSolutionsByUserId, getQuizzesByUserId, getQuizByQuizId, getSolutionsCount, deleteQuiz } from '../api/data.js';

const template = (update) => html`${until(update(), cubeLoader())}`;

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
    const userLastSolutionData = await getSolutionsByUserId(user.userId); // empty array if none
    const quizzesCreatedByUserData = await getQuizzesByUserId(user.userId); // empty array if none
    const data = { userLastSolution: null, userLastCompleteQuiz: null, quizzesCreatedByUser: null };

    ctx.render(until(template(update), cubeLoader()));

    async function onEdit(id) {
        console.log(id);
        //ctx.render(template());
    }

    async function onDelete(id) {
        console.log(id);
        // await deleteQuiz(id);
        // ctx.render(template());
    }

    async function update() {
        // loader can be tested only with at least one quiz in the database,
        // otherwise 'await' operator won't be called and therefore the function won't return promise
        // and as a result the loader won't function!

        if (userLastSolutionData.length) {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const userLastSolution = userLastSolutionData.slice(-1).shift();
            data.userLastCompleteQuiz = await getQuizByQuizId(userLastSolution.quiz.objectId);
            data.userLastSolution = userLastSolution;
            const date = new Date(userLastSolution.createdAt);
            data.userLastSolution.date = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
        }

        if (quizzesCreatedByUserData.length) {
            // double-check -> quizTakenTimes
            data.quizzesCreatedByUser = quizzesCreatedByUserData;
            Object.assign(quizTakenTimes, await getSolutionsCount(data.quizzesCreatedByUser.map((q) => q.objectId)));
        }

        return html`
            <section id="profile">
                <div class="hero pad-large">
                    <article class="glass pad-large profile">
                        <h2>Profile Details</h2>
                        <p>
                            <span class="profile-info">Username:</span>
                            ${user.username}
                        </p>
                        <p>
                            <span class="profile-info">Email:</span>
                            ${user.email}
                        </p>
                        <h2>Your Last Quiz Result</h2>
                        <table class="quiz-results">
                            <tbody>
                                ${data.userLastSolution
                                    ? html` <tr class="results-row">
                                          <td class="cell-1">${data.userLastSolution.date}</td>
                                          <td class="cell-2">
                                              <a href=${'/details/' + data.userLastCompleteQuiz.objectId}>${data.userLastCompleteQuiz.title}</a>
                                          </td>
                                          <td class="cell-3 s-correct">
                                              ${((data.userLastSolution.correct / data.userLastSolution.total) * 100).toFixed(2)}%
                                          </td>
                                          <td class="cell-4 s-correct">${data.userLastSolution.correct}/${data.userLastSolution.total} correct answers</td>
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
                    ${data.quizzesCreatedByUser
                        ? data.quizzesCreatedByUser.map((q) => quizTemplate(q, quizTakenTimes, onEdit, onDelete))
                        : html`
                              <h2>You haven't created any quizzes yet.</h2>
                              <br />
                              <a href="/create">Create one now</a>
                          `}
                </div>
            </section>
        `;
    }
}
