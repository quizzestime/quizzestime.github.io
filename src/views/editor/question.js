import createAnswerList from './answer.js';
import { html, render } from '../../lib.js';

const viewTemplate = (question, index, onEdit, onDelete) => html`
    <div class="layout">
        <div class="question-control">
            <button @click=${onEdit} class="input submit action"><i class="fas fa-edit"></i> Edit</button>
            <button @click=${() => onDelete(index)} class="input submit action"><i class="fas fa-trash-alt"></i> Delete</button>
        </div>
        <h3>Question ${index + 1}</h3>
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
        <h3>Question ${index + 1}</h3>
    </div>

    <form>
        <textarea class="input editor-input editor-text" name="text" placeholder="Enter question" .value=${question.text}></textarea>

        ${createAnswerList(question, index)}
    </form>
`;

// loading -> <div class="loading-overlay working"></div>

export default function createQuestion(question, removeQuestion) {
    let index = 0;
    let editorActive = false;
    let currentQuestion = copyQuestion(question);
    const element = document.createElement('article');
    element.classList.add('editor-question');

    showView();
    return update;

    async function onEdit() {
        editorActive = true;
        showEditor();
    }

    function onCancel() {
        editorActive = false;
        currentQuestion = copyQuestion(question);

        showView();
    }

    async function onSave() {
        const formData = new FormData(element.querySelector('form'));
        const data = [...formData.entries()].reduce((a, [k, v]) => Object.assign(a, { [k]: v }), {});
        console.log(data);

        editorActive = false;
    }

    function update(newIndex) {
        index = newIndex;
        editorActive ? showEditor() : showView();

        return element;
    }

    function showView() {
        render(viewTemplate(currentQuestion, index, onEdit, removeQuestion), element);
    }

    function showEditor() {
        render(editorTemplate(currentQuestion, index, onSave, onCancel), element);
    }
}

function copyQuestion(question) {
    const currentQuestion = Object.assign({}, question);
    currentQuestion.answers = currentQuestion.answers.slice();

    return currentQuestion;
}
