'use strict';

require('dotenv').config({path: './../.env'});

import fs from 'fs';
import path from 'path';
import ora from 'ora';
import chalk from 'chalk';
import CloudFrontClient from 'aws-sdk/clients/cloudfront';

import ICON_DIRS from '../util/icon-dirs.json';

const spinner = ora();

const cf = new CloudFrontClient({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

/**
 * Get all local icons paths formatted as S3 object keys.
 * @returns {array} An array of S3 object keys.
 * @example [
 *      '/icons/github.svg',
 *      '/icons/dark/github.svg',
 *      ...
 * ]
 */
const getAllIcons = () => {
	const icons = [];

	Object.keys(ICON_DIRS).forEach(dir => {
		const files = fs.readdirSync(path.join(__dirname, ICON_DIRS[dir]));

		files.forEach(file =>
			icons.push(
				`/icons/${dir === 'color' ? '' : `${dir}/`}${file}`
			)
		);
	});

	return icons;
};

(() => {
	if (
		!process.env ||
        !process.env.AWS_ACCESS_KEY_ID ||
        !process.env.AWS_SECRET_ACCESS_KEY ||
        !process.env.AWS_CLOUDFRONT_DISTRIBUTION
	) {
		chalk.red.bold('Can\'t find AWS environment variables');
		return;
	}

	const ITEMS = getAllIcons();

	const parameters = {
		DistributionId: process.env.AWS_CLOUDFRONT_DISTRIBUTION,
		InvalidationBatch: {
			CallerReference: `brandIconsBuild-${Date.now()}`,
			Paths: {
				Quantity: ITEMS.length,
				Items: ITEMS
			}
		}
	};

	spinner.start('Clearing the CDN cache...');

	cf.createInvalidation(parameters, err => {
		if (err) {
			throw (err.stack);
		}

		spinner.succeed('CDN cache cleared 🎉');
	});
})();
