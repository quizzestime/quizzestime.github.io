import createAnswerList from './answer.js';
import { html, render } from '../../lib.js';

const viewTemplate = (question, index, onEdit, onDelete) => html`
    <div class="layout">
        <div class="question-control">
            <button @click=${onEdit} class="input submit action"><i class="fas fa-edit"></i> Edit</button>
            <button @click=${onDelete} class="input submit action"><i class="fas fa-trash-alt"></i> Delete</button>
        </div>
        <h3>Question ${index}</h3>
    </div>
    <div>
        <p class="editor-input">${question.text}</p>

        ${question.answers.map((a, i) => radioView(a, question.correctIndex === i))}
    </div>
`;

const radioView = (value, checked) => html`
    <div class="editor-input">
        <label class="radio">
            <input class="input" type="radio" disabled ?checked=${checked} />
            <i class="fas fa-check-circle"></i>
        </label>
        <span>${value}</span>
    </div>
`;

const editorTemplate = (question, index, onSave, onCancel) => html`
    <div class="layout">
        <div class="question-control">
            <button @click=${onSave} class="input submit action"><i class="fas fa-check-double"></i> Save</button>
            <button @click=${onCancel} class="input submit action"><i class="fas fa-times"></i> Cancel</button>
        </div>
        <h3>Question ${index}</h3>
    </div>

    <form>
        <textarea class="input editor-input editor-text" name="text" placeholder="Enter question" .value=${question.text}></textarea>

        ${createAnswerList(question.answers, index, question.correctIndex)}
    </form>
`;

// loading -> <div class="loading-overlay working"></div>

export default function createQuestion(question, index, editMode = false) {
    const element = document.createElement('article');
    element.classList.add('editor-question');

    if (editMode) {
        showEditor();
    } else {
        showView();
    }

    return element;

    async function onEdit() {
        showEditor();
    }

    async function onSave() {
        const formData = new FormData(element.querySelector('form'));
        const data = [...formData.entries()].reduce((a, [k, v]) => Object.assign(a, { [k]: v }), {});
    }

    function onCancel() {
        showView();
    }

    async function onDelete() {
        const confirmed = confirm('Are you sure you want to delete this question?'); // replace with modal later on
        if (confirmed) {
            element.remove();
        }
    }

    function showView() {
        render(viewTemplate(question, index, onEdit, onDelete), element);
    }

    function showEditor() {
        render(editorTemplate(question, index, onSave, onCancel), element);
    }
}
