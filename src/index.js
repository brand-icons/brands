import getAttributes from '../util/helpers/get-attributes';
import mapColor from '../util/helpers/map-color';
import toClass from '../util/helpers/to-class';

import * as icons from './icons';

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
		throw new TypeError('`brands.render()` only works in a browser environment.');
	}

	/* eslint-disable-next-line no-undef */
	const elementsToReplace = document.querySelectorAll('[data-brand-icon]');

	/**
	 * Add support for NodeList.forEach().
	 * https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach
	 */
	/* eslint-disable no-undef */
	if (window.NodeList && !NodeList.prototype.forEach) {
		NodeList.prototype.forEach = Array.prototype.forEach;
	}
	/* eslint-enable no-undef */

	elementsToReplace.forEach(element =>
		renderElement(element, color, attributes)
	);
};

/**
	 * Replaces HTML element with an SVG.
	 * @param {node} element - Element to replace.
	 * @param {string} color - SVG color.
	 * @param {object} attributes HTML attributes.
	 * @returns {void}
	 */
function renderElement(element, color, attributes = {}) {
	const defaultColors = ['color', 'dark', 'light'];
	const mappedColor = mapColor(color);

	const elementAttrs = getAttributes.parse(element);
	const brand = elementAttrs['data-brand-icon'];
	delete elementAttrs['data-brand-icon'];

	if (elementAttrs['data-brand-color']) {
		color = elementAttrs['data-brand-color'];
		delete elementAttrs['data-brand-color'];
	}

	if (element.tagName === 'IMG') {
		element.removeAttribute('data-brand-icon');
		element.removeAttribute('data-brand-color');

		element.height = attributes.height || 24;
		element.width = attributes.width || 24;
		element.src = `https://cdn.brandicons.org?brand=${brand}${
			mappedColor === 'color' ?
				'' :
				`&color=${
					defaultColors.includes(mappedColor) ?
						mappedColor :
						encodeURIComponent(color)
				}`
		}`;

		return;
	}

	const svg = icons[brand].toSvg(
		color,
		{
			...attributes,
			...elementAttrs,
			...{class: toClass(
				attributes.class,
				elementAttrs.class
			)
			}
		}
	);

	element.outerHTML = svg;
}

export {
	render
};
