import { getQuizzes } from '../api/data.js';
import { categories, html, until } from '../lib.js';
import { createCubeLoader } from './common/loader.js';

const template = () => html`
    <section id="browse">
        <header class="pad-large">
            <form class="browse-filter">
                <input class="input" type="text" name="query" />
                <select class="input" name="topic">
                    <option value="all">All Categories</option>
                    ${Object.entries(categories).map(([k, v]) => html`<option value=${k}>${v}</option>`)}
                </select>
                <input class="input submit action" type="submit" value="Filter Quizzes" />
            </form>
            <h1>All quizzes</h1>
        </header>

        ${until(loadQuizzes(), createCubeLoader())}
    </section>
`;

async function loadQuizzes() {
    const quizzes = await getQuizzes();
    return html` <div class="pad-large alt-page">${quizzes.results.map(quizTemplate)}</div>`;
}

const quizTemplate = (quiz) => html`
    <article class="preview layout">
        <div class="right-col">
            <a class="action cta" href=${'/details/' + quiz.objectId}>View Quiz</a>
        </div>
        <div class="left-col">
            <h3 class="open-quiz"><a class="quiz-title-link" href=${'/details/' + quiz.objectId}>${quiz.title}</a></h3>
            <br />
            <span class="quiz-topic">Category: ${quiz.category}</span>
            <div class="quiz-meta">
                <span>${quiz.questionCount} question${quiz.questionCount === 1 ? null : 's'}</span>
                <span>|</span>
                <span>Taken ? times</span>
            </div>
        </div>
    </article>
`;

export default async function browsePage(ctx) {
    ctx.render(template());
}
