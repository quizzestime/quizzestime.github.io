import { html, until } from '../lib.js';
import { categories } from '../util.js';
import { getQuizzes } from '../api/data.js';
import { cubeLoader } from './common/loader.js';
import { quizTemplate } from './common/quiz-preview.js';

const template = () => html`
    <section id="browse">
        <header class="pad-large">
            <form class="browse-filter">
                <input class="input" type="text" name="query" />
                <select class="input" name="topic">
                    <option value="all">All Categories</option>
                    ${Object.entries(categories).map(([k, v]) => html`<option value=${k}>${v}</option>`)}
                </select>
                <input class="input submit action" type="submit" value="Search/Filter Quizzes" />
            </form>

            <h1>All quizzes</h1>
        </header>

        ${until(loadQuizzes(), cubeLoader())}
    </section>
`;

async function loadQuizzes() {
    // implement filter logic!
    const quizzes = await getQuizzes();
    return Array.isArray(quizzes)
        ? html`<div class="pad-large alt-page">${quizzes.map(quizTemplate)}</div> `
        : html`<h1 class="no-quizzes-available">Currently there no quizzes available!</h1>`;
}

export default async function browsePage(ctx) {
    ctx.render(template());
}
