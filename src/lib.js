import page from '//unpkg.com/page/page.mjs';
import { html, render } from '//unpkg.com/lit-html?module';
import { until } from '//unpkg.com/lit-html/directives/until?module';

// import page from "../node_modules/page/page.mjs";
// import { html, render } from "../node_modules/lit-html/lit-html.js";

const categories = {
    hardware: 'Hardware',
    languages: 'Languages',
    frameworks: 'Frameworks',
    software: 'Tools and Software',
};

export { page, html, render, until, categories };
