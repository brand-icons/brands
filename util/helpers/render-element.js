import toClass from 'to-class';
import getAttributes from 'get-attributes';

import mapColor from './map-color';
import {buildUrl} from './build-url';

import icons from '../../src/icons';

/**
 * Replaces HTML element with an SVG.
 * @param {node} element - Element to replace.
 * @param {string} color - SVG color.
 * @param {object} attributes HTML attributes.
 * @returns {void}
 */
const renderElement = (element, color, attributes) => {
	const elementAttrs = getAttributes.parse(element);

	if (elementAttrs['data-brand-color']) {
		color = elementAttrs['data-brand-color'];
		delete elementAttrs['data-brand-color'];
	}

	const mappedColor = mapColor(color);
	const brand = elementAttrs['data-brand-icon'];
	delete elementAttrs['data-brand-icon'];

	if (element.tagName === 'IMG') {
		const url = buildUrl(mappedColor, brand);

		element.removeAttribute('data-brand-icon');
		element.removeAttribute('data-brand-color');

		element.height = attributes.height || 24;
		element.width = attributes.width || 24;
		element.src = url;

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
};

export {
	renderElement
};
