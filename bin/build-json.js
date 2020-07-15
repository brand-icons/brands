import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import jsdom from 'jsdom';

import ICON_DIRS from '../util/icon-dirs.json';

const ICON_JSON_PATH = '../dist/icons.json';
const ICONS = {};

/**
 * Get the contents of a file.
 * @param {string} file - A filename.
 * @param {string} pathname - A path.
 * @returns {string}
 */
const getFileContents = (file, pathname) => fs.readFileSync(path.join(pathname, file));

/**
 * Get the inner contents of an SVG.
 * @param {string} svg - An SVG string.
 * @returns {string}
 */
const getSvgContents = svg => {
	const SVG_DOM = new jsdom.JSDOM(svg).window.document;
	const SVG_EL = SVG_DOM.querySelector('svg');

	return SVG_EL.innerHTML.trim();
};

/**
 * Build an object of icons.
 * @param {string} dir - A directory.
 * @returns {Promise<object[]>}
 */
const buildIconObject = dir => {
	return new Promise((resolve, reject) => {
		const pathname = ICON_DIRS[dir];

		if (!fs.existsSync(pathname)) {
			chalk.red.bold(`Cannot find directory ${pathname}`);
			reject();
		}

		const ICON_DIR = path.resolve(__dirname, pathname);
		const files = fs
			.readdirSync(ICON_DIR)
			.filter(icon => path.extname(icon) === '.svg');

		const icons = files
			.map(file => {
				const name = path.basename(file, '.svg');
				const svg = getFileContents(file, pathname);
				const contents = getSvgContents(svg);
				return {name, contents, type: dir};
			});

		icons.forEach(icon => {
			const brand = ICONS[icon.name] || {};
			brand[icon.type] = icon.contents;
			ICONS[icon.name] = brand;
		});

		resolve(icons);
	});
};

const icons = Object.keys(ICON_DIRS).map(dir => buildIconObject(dir));

Promise.all(icons)
	.then(() => fs.writeFileSync(ICON_JSON_PATH, JSON.stringify(ICONS)))
	.catch(error => console.log(error));
