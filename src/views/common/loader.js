import { html } from '../../lib.js';

export const createOverlayLoader = () => {
    const element = document.createElement('div');
    element.classList.add('loading-overlay', 'working');
    return element;
};

export const overlayLoader = html`<div class="loading-overlay working"></div>`;

export const createCubeLoader = () => html`
    <div class="pad-large alt-page async">
        <div class="sk-cube-grid">
            <div class="sk-cube sk-cube1"></div>
            <div class="sk-cube sk-cube2"></div>
            <div class="sk-cube sk-cube3"></div>
            <div class="sk-cube sk-cube4"></div>
            <div class="sk-cube sk-cube5"></div>
            <div class="sk-cube sk-cube6"></div>
            <div class="sk-cube sk-cube7"></div>
            <div class="sk-cube sk-cube8"></div>
            <div class="sk-cube sk-cube9"></div>
        </div>
    </div>
`;
