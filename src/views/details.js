import { html } from '../lib.js';

// Static content ->
const template = () => html`
	<section id="details">
		<div class="pad-large alt-page">
			<article class="details">
				<h1>Extensible Markup Language</h1>
				<span class="quiz-topic">A quiz by <a href="#">Peter</a> on the topic of Languages</span>
				<div class="quiz-meta">
					<span>15 Questions</span>
					<span>|</span>
					<span>Taken 189 times</span>
				</div>
				<p class="quiz-desc">
					Test your knowledge of XML by completing this medium-difficulty quiz. Lorem ipsum dolor sit amet consectetur
					adipisicing elit. Aliquam recusandae corporis voluptatum quibusdam maxime similique reprehenderit rem, officia
					vero at.
				</p>

				<div>
					<a class="cta action" href="#">Begin Quiz</a>
				</div>
			</article>
		</div>
	</section>
`;

export default async function detailsPage(ctx) {
	ctx.render(template());
}
