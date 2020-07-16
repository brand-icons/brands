import toClass from './to-class';
import attrsToString from './attrs-to-string';
import mapColor from './map-color';

import DEFAULT_ATTRS from '../default-attrs.json';

/**
 * Gives super powers to the icons.
 * @param {string} name - Brand name.
 * @param {object} contents - SVG contents with format:
 *  {
 *      color: <string>,
 *      dark: <string>,
 *      light: <string>
 *  }
 */
const Icon = (name, contents) => {
	if (!name || !contents) {
		throw new ReferenceError('One or more required arguments not supplied to `Icons`.');
	}

	if (typeof contents !== 'object') {
		throw new TypeError('`contents` argument passed to `Icons` must be of type object.');
	}

	const brandName = name;
	const svgContents = contents;
	const defaultAttributes = {
		...DEFAULT_ATTRS,
		...{class: `brand-icon ${name}`},
		...{height: 24, width: 24}
	};
	const defaultColors = new Set(['color', 'dark']);

	/**
     * Covert an icon to SVG.
     * @param {object} params - An object of HTML% attributes
     * @returns {string}
     */
	const toSvg = (
		color = 'color',
		attributes = {}
	) => {
		if (typeof color !== 'string') {
			throw new TypeError('The `color` parameter passed to `brands.toSvg()` must be a string.');
		}

		if (typeof attributes !== 'object') {
			throw new TypeError('The `attributes` parameter passed to `brands.toSvg()` must be an object.');
		}

		const svgAttributes = {
			...defaultAttributes,
			...attributes,
			...{class: toClass(
				defaultAttributes.class,
				attributes.class
			)}
		};

		/**
         *
         * @param {string} svg - SVG string.
         * @param {string} hex - Hex value
         * @returns {string}
         */
		const customColor = (svg, color) => svg.replace(/fill="#000"/g, `fill="${color}"`);

		// Handle empty string.
		const mappedColor = mapColor(color);

		return `<svg ${attrsToString(svgAttributes)}>${
			defaultColors.has(mappedColor) ?
				svgContents[mappedColor] :
				customColor(
					svgContents.dark,
					mappedColor === 'light' ?
						'#fff' :
						color
				)
		}</svg>`;
	};

	return {
		name: brandName,
		contents: svgContents,
		attributes: defaultAttributes,
		toSvg
	};
};

export default Icon;
