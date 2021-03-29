import { html } from '../../lib.js';

export const createOverlay = () => {
    const element = document.createElement('div');
    element.classList.add('loading-overlay', 'working');
    return element;
};

export const overlay = html`<div class="loading-overlay working"></div>`;
