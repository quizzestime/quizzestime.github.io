import page from '//unpkg.com/page/page.mjs';
import { html, render } from '//unpkg.com/lit-html?module';
import { until } from '//unpkg.com/lit-html/directives/until?module';
import { cache } from '//unpkg.com/lit-html/directives/cache?module';
import { styleMap } from '//unpkg.com/lit-html/directives/style-map?module';
import { classMap } from '//unpkg.com/lit-html/directives/class-map?module';

// import page from "../node_modules/page/page.mjs";
// import { html, render } from "../node_modules/lit-html/lit-html.js";

const categories = {
	hardware: 'Hardware',
	languages: 'Languages',
	frameworks: 'Frameworks',
	software: 'Tools and Software',
};

export { page, html, render, until, cache, styleMap, classMap, categories };
