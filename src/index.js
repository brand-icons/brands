import getAttributes from '../util/helpers/getAttributes';
import Icon from '../util/helpers/icon';
import mapColor from '../util/helpers/mapColor';
import toClass from '../util/helpers/toClass';

import ICONS from '../dist/icons.json';

export default (function () {
	'use strict';

	/**
     * Public API
     */

	const icons = {};

	Object.keys(ICONS)
		.map(icon => new Icon(
			icon,
			ICONS[icon]
		))
		.forEach(icon => {
			icons[icon.name] = icon;
		});

	/**
     * Replaces all elements with a `data-brand-icon`
     * attributes with the respective brand SVG.
     * @param {object} - An object with format: `{ color: <string>, attributes: <object> }`.
     */
	const render = ({
		color = 'color',
		attributes = {}
	} = {}) => {
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

	return {icons, render};

	/**
     * Private API
     */

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

		const svg = icons[brand].toSvg({
			color,
			attributes: {
				...attributes,
				...elementAttrs,
				...{class: toClass(
					attributes.class,
					elementAttrs.class
				)
				}
			}
		});

		element.outerHTML = svg;
	}
})();
