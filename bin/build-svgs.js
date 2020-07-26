'use strict';

import fs from 'fs';
import path from 'path';
import ora from 'ora';
import chalk from 'chalk';

import ICONS from '../dist/icons.json';
import ICON_DIRS from '../util/icon-dirs.json';
import DEFAULT_ATTRS from '../util/default-attrs.json';

import getAttributes from 'get-attributes';

const spinner = ora();

/**
 * Build an SVG string.
 * @param {string} content - Content inside the SVG.
 * @returns {string}
 */
const buildSvg = content => `<svg ${getAttributes.stringify(DEFAULT_ATTRS)}>${content}</svg>`;

Object.keys(ICON_DIRS).forEach(color => {
	if (!fs.existsSync(`../dist/icons/${color}`)) {
		fs.mkdirSync(`../dist/icons/${color}`);
	}

	const ICON_DIR = path.resolve(__dirname, `../dist/icons/${color}`);

	spinner.start(`Building ${color} SVGs...`);

	Object.keys(ICONS).forEach(brand => {
		const svg = color === 'light' ?
			buildSvg(ICONS[brand].dark).replace(/fill="#000"/g, 'fill="#fff"') :
			buildSvg(ICONS[brand][color]);

		try {
			fs.writeFileSync(path.join(ICON_DIR, `${brand}.svg`), svg);
		} catch (error) {
			chalk.red.bold(`Could not build ${brand} SVG: ${error}`);
		}
	});

	spinner.succeed(`Built ${color} SVGs`);
});
