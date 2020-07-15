import fs from 'fs';
import path from 'path';
import ora from 'ora';
import icons from '../dist/icons.json';

import ICON_DIRS from '../util/icon-dirs.json';
import DEFAULT_ATTRS from '../util/default-attrs.json';

const spinner = ora();

const BRANDS = Object.keys(icons);

/**
 * Get all icon objects for a given color with
 * the format: `{ name: <string>, content: <string> }`.
 * @param {string} dir - A directory.
 * @returns {object[]}
 */
const getSvgStringsByColor = dir =>
	BRANDS.map(
		brand => (
			{
				name: brand,
				content: icons[brand][dir]
			}
		)
	);

/**
 * Build an SVG symbol.
 * @param {string} name - A brand name.
 * @param {string} content The inner SVG content.
 * @returns {string}
 */
const buildSymbol = (name, content) =>
	`<symbol id="${name}" viewBox="${DEFAULT_ATTRS.viewBox}">${content}</symbol>`;

/**
 * Build a sprite.
 * @param {object[]} icons - An array of icon objects.
 * @returns {string}
 */
const buildSprite = icons => {
	const symbols = Object.values(icons)
		.map(icon =>
			buildSymbol(
				icon.name,
				icon.content
			)
		)
		.join('');

	return `<svg xmlns="${DEFAULT_ATTRS.xmlns}"><defs>${symbols}</defs></svg>`;
};

Object.keys(ICON_DIRS).forEach(dir => {
	spinner.start(`Building ${dir} sprite...`);

	const SPRITE_FILE = path.resolve(__dirname, `../dist/brands-${dir}-sprite.svg`);
	const icons = getSvgStringsByColor(dir);

	try {
		fs.writeFileSync(SPRITE_FILE, buildSprite(icons));
		spinner.succeed(`Built ${dir} sprite`);
	} catch(e) {
		spinner.fail(`Could not build ${dir} sprite: ${e}`);
	}
});
