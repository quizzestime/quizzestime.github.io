import { categories } from '../../util.js';
import { html, until } from '../../lib.js';
import { lineLoader } from '../common/loader.js';
import { getSolutionCount } from '../../api/data.js';

const detailsTemplate = (quiz) => html` <section id="details">
	<div class="pad-large alt-page">
		<article class="details">
			<h1>${quiz.title}</h1>
			<span class="quiz-topic"
				>A quiz by <a href="/users/${quiz.owner.objectId}">${quiz.owner.username}</a> on the topic of
				<strong>${categories[quiz.category]}</strong></span
			>
			${until(loadCount(quiz), lineLoader())}
			<p class="quiz-desc">${quiz.description}</p>

			<div>
				<a class="cta action" href="/quiz/${quiz.objectId}">Begin Quiz</a>
			</div>
		</article>
	</div>
</section>`;

async function loadCount(quiz) {
	const taken = (await getSolutionCount([quiz.objectId]))[quiz.objectId] || 0;

	return html` <div class="quiz-meta">
		<span>${quiz.questionCount} question${quiz.questionCount == 1 ? '' : 's'}</span>
		<span>|</span>
		<span>Taken ${taken} time${taken == 1 ? '' : 's'}</span>
	</div>`;
}

export default async function detailsPage(ctx) {
	ctx.render(detailsTemplate(ctx.quiz));
}
