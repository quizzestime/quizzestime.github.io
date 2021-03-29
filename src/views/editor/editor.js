import createList from './list.js';
import { html, render } from '../../lib.js';
import { createQuiz, updateQuiz, getQuizzes, getQuestionsByQuizId } from '../../api/data.js';

const template = (quiz, quizEditor, updateCount) => html`
    <section id="editor">
        <header class="pad-large">
            <h1>${quiz ? 'Edit Quiz' : 'New Quiz'}</h1>
        </header>

        ${quizEditor} ${quiz ? createList(quiz.objectId, quiz.questions, updateCount) : null}
    </section>
`;

const quizEditor = (onSave, quiz, loading) => html`
    <form @submit=${onSave}>
        <label class="editor-label layout">
            <span class="label-col">Quiz Title:</span>
            <input class="input i-med" type="text" name="title" .value=${quiz ? quiz.title : null} ?disabled=${loading} />
        </label>

        <label class="editor-label layout">
            <span class="label-col">Category:</span>
            <select class="input i-med" name="category" .value=${quiz ? quiz.category : '0'} ?disabled=${loading}>
                <option value="0"><span class="quiz-meta">-- Select Category</span></option>
                <option value="languages">Languages</option>
                <option value="hardware">Hardware</option>
                <option value="software">Tools and Software</option>
            </select>
        </label>

        <label class="editor-label layout">
            <span class="label-col">Description</span>
            <textarea class="input i-med" name="description" .value=${quiz ? quiz.description : null} ?disabled=${loading}></textarea>
        </label>

        <input class="input submit action" type="submit" value="Save" />
    </form>

    ${loading ? html`<div class="loading-overlay working"></div>` : null}
`;

function createQuizEditor(onSave, quiz) {
    const editor = document.createElement('div');
    editor.classList.add('pad-large', 'alt-page');
    update();

    return {
        editor,
        updateEditor: update,
    };

    function update(loading) {
        render(quizEditor(onSave, quiz, loading), editor);
    }
}

export default async function editorPage(ctx) {
    const quizId = ctx.params.id;
    const [quiz, questions] = quizId ? await Promise.all([getQuizzes(quizId), getQuestionsByQuizId(quizId)]) : [null, []];
    quiz.questions = questions;

    const { editor, updateEditor } = createQuizEditor(onSave, quiz);
    ctx.render(template(quiz, editor, updateCount));

    async function updateCount(change = 0) {
        const count = questions.length + change;
        await updateQuiz(quizId, { questionCount: count });
    }

    async function onSave(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const [title, category, description] = [formData.get('title'), formData.get('category'), formData.get('description')];
        const data = { title, category, description, questionCount: questions.length };

        try {
            updateEditor(true);
            if (quizId) {
                await updateQuiz(quizId, data);
            } else {
                const response = await createQuiz(data);
                ctx.page.redirect('/edit/' + response.objectId);
            }
        } catch (err) {
            console.error(err);
        } finally {
            updateEditor(false);
        }
    }
}
