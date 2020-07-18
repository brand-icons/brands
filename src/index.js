/* eslint-disable import/no-anonymous-default-export */

import {renderElement} from '../util/helpers/render-element';

/**
 * Replaces all elements with a `data-brand-icon`
 * attributes with the respective brand SVG.
 * @param {string} color - The SVG color `color|dark|light`.
 * @param {object} attributes - The SVG HTML attributes.
 * @returns {void}
 */
const render = (
	color = 'color',
	attributes = {}
) => {
	/* eslint-disable-next-line no-undef */
	if (typeof document === 'undefined') {
		throw new ReferenceError('`brands.render()` only works in a browser environment.');
	}

	/* eslint-disable-next-line no-undef */
	const elementsToReplace = document.querySelectorAll('[data-brand-icon]');

	elementsToReplace.forEach(element =>
		renderElement(element, color, attributes)
	);
};

export default {
	render
};
