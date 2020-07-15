'use strict';

import fs from 'fs';
import path from 'path';
import ora from 'ora';

import optimizeSvg from './optimize-svg';

import ICON_DIRS from '../util/icon-dirs.json';

const spinner = ora();

Object.keys(ICON_DIRS).forEach(dir => {
	const ICON_DIR = path.resolve(__dirname, ICON_DIRS[dir]);

	spinner.start(`Optimizing ${dir} SVGs...`);

	try {
		const ICONS = fs.readdirSync(ICON_DIR);

		ICONS
			.filter(file => path.extname(file) === '.svg')
			.forEach(async svg => {
				const ICON_PATH = path.join(ICON_DIR, svg);
				const ICON = fs.readFileSync(ICON_PATH);

				try {
					const newSvg = await optimizeSvg(ICON, dir);
					fs.writeFileSync(ICON_PATH, newSvg);
				} catch (error) {
					spinner.fail(`🚨 Failed optimizing ${svg}: ${error}`);
				}
			});

		spinner.succeed(`🎉 Optimized ${dir} SVGs`);
	} catch (error) {
		spinner.fail(error);
	}
});
