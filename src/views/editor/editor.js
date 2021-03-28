import createList from './list.js';
import { html } from '../../lib.js';

const template = (quiz) => html`
    <section id="editor">
        <header class="pad-large">
            <h1>${quiz ? 'Edit Quiz' : 'New Quiz'}</h1>
        </header>

        <div class="pad-large alt-page">
            <form>
                <label class="editor-label layout">
                    <span class="label-col">Quiz Title:</span>
                    <input class="input i-med" type="text" name="title" .value=${quiz ? quiz.title : ''} />
                </label>

                <label class="editor-label layout">
                    <span class="label-col">Category:</span>
                    <select class="input i-med" name="category" .value=${quiz ? quiz.category : '0'}>
                        <option value="0"><span class="quiz-meta">--Select Category</span></option>
                        <option value="languages">Languages</option>
                        <option value="hardware">Hardware</option>
                        <option value="software">Tools and Software</option>
                    </select>
                </label>
                <input class="input submit action" type="submit" value="Save" />
            </form>
        </div>

        ${quiz ? createList(quiz.questions) : null}
    </section>
`;

const questions = [
    {
        text: 'Is this Question 1?',
        answers: ['A', 'Yes', 'C'],
        correctIndex: 1,
    },
    {
        text: 'Is this Question 2?',
        answers: ['Yes', 'B', 'D'],
        correctIndex: 0,
    },
    {
        text: 'IS this Question 3?',
        answers: ['E', 'F', 'Yes'],
        correctIndex: 2,
    },
];

export default async function editorPage(ctx) {
    let quiz = null;
    const quizId = ctx.params.id;

    if (quizId) {
        quiz = {
            title: 'Test Quiz',
            category: 'languages',
            questions: [],
        };
    }

    ctx.render(template(quiz));
}
  