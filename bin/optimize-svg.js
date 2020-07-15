import Svgo from 'svgo';
import jsdom from 'jsdom';
import {format as formatSvg} from 'prettier';

import DEFAULT_ATTRS from '../util/default-attrs.json';

/**
 * Get a new `Svgo` instance.
 * @param {string} color - SVG color: `color|dark|light`.
 */
const SVGO = (color) => new Svgo({
		plugins: [
			{convertShapeToPath: false},
			{removeAttrs: {attrs: 'svg:fill:none'}},
			{
				// If `color` is anything other that 'color'
				// then we want to merge the paths.
				mergePaths: color !== 'color'
			},
			{removeViewBox: false},
			{removeDimensions: true},
			{removeTitle: true}
		]
	});

/**
 * Process SVG string.
 * @param {string} svg - An SVG string.
 * @param {string} color - The SVG color `color|dark|light`.
 * @returns {Promise<string>}
 */
function optimizeSvg(svg, color) {
	return (
		minifySvg(svg, color)
			.then(setSvgAttributes)
			.then(svg =>
				formatSvg(svg, {
					parser: 'babel'
				})
			)
			.then(svg => svg.replace(/;/g, ''))
	);
}

/**
 * Optimize SVG with `svgo`.
 * @param {string} svg - An SVG string.
 * @returns {Promise<string>}
 */
const minifySvg = (svg, color) => SVGO(color).optimize(svg).then(({data}) => data);

/**
 * Set default attibutes on SVG.
 * @param {string} svg - An SVG string.
 * @returns {string}
 */
async function setSvgAttributes(svg) {
	return new Promise(resolve => {
		const SVG_DOM = new jsdom.JSDOM(svg).window.document;
		const SVG_EL = SVG_DOM.querySelector('svg');

		Object.keys(DEFAULT_ATTRS).forEach(key =>
			SVG_EL.setAttribute(key, DEFAULT_ATTRS[key])
		);

		resolve(SVG_EL.outerHTML);
	});
}

export default optimizeSvg;
