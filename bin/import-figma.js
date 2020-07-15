'use strict';

require('dotenv').config({path: './../.env'});

import fs from 'fs';
import path from 'path';
import ora from 'ora';
import axios from 'axios';
import * as figma from 'figma-js';

import ICON_DIRS from '../util/icon-dirs.json';

const spinner = ora();
const FIGMA_FRAME = 'Icons';

const figmaClient = figma.Client({
	personalAccessToken: process.env.FIGMA_API_TOKEN
});

/**
 * Gets all icons from the Figma file.
 * @returns {Promise<object[]>}
 */
const getFigmaFile = () => {
	spinner.start('Fetching Figma file...');

	return new Promise((resolve, reject) => {
		figmaClient.file(process.env.FIGMA_FILE_ID)
			.then(({data}) => {
				const icons = [];

				Object.keys(ICON_DIRS).forEach(dir => {
					const page = dir.toLowerCase();
					const canvas = data.document.children.find(
						child => child.name.toLowerCase() === page
					);
					const frame = canvas.children.find(child => child.name === FIGMA_FRAME);

					frame.children.forEach(child => {
						icons.push({
							id: child.id,
							name: child.name,
							color: dir
						});
					});
				});

				spinner.succeed('Fetched Figma file.');
				resolve(icons);
			})
			.catch(error => {
				spinner.fail(`Error fetching Figma file: ${
					error.response ?
						`${error.response.data.status}: ${error.response.data.err}` :
						error
				}`);

				reject();
			});
	});
};

/**
 * Get the S3 url for each Figma icon, adds a new key: `url`
 * to each icon object passed into `icons` and returns the array.
 * @param {object[]} icons - A list of icon objects.
 * @returns {Promise<object[]>}
 */
const getUrls = icons => {
	spinner.start('Fetching icons from Figma file...');

	return new Promise((resolve, reject) => {
		figmaClient
			.fileImages(process.env.FIGMA_FILE_ID, {
				format: 'svg',
				ids: icons.map(icon => icon.id)
			})
			.then(({data}) => {
				if (data.err) {
					spinner.fail();
					reject();
				}

				icons.forEach(icon => {
					icon.url = data.images[icon.id];
				});

				spinner.succeed('Fetched icons from Figma file.');
				resolve(icons);
			})
			.catch(error => {
				spinner.fail(`Error fetching icons from Figma file: ${error}`);
				reject();
			});
	});
};

/**
 * Downloads an icon file from S3.
 * @param {object} icon - An icon object with format:
 *  {
 *      id: <string>,
 *      *name: <string>,
 *      *color: <string>,
 *      *url: <string>
 *  }
 * @returns {Promise<any>}
 */
const downloadFile = async icon => {
	const filename = [
		icon.name
			.split(' ')
			.map(string => string.toLowerCase())
			.join(''),
		'.svg'
	].join('');

	const directory = [
		'../',
		'icons',
		'/',
		icon.color
	].join('');

	const pathname = [
		directory,
		'/',
		filename
	].join('');

	if (!fs.existsSync(directory)) {
		fs.mkdirSync(directory);
	}

	const writer = fs.createWriteStream(
		path.resolve(__dirname, pathname)
	);

	const response = await axios({
		url: icon.url,
		method: 'GET',
		responseType: 'stream'
	});

	response.data.pipe(writer);

	return new Promise((resolve, reject) => {
		writer.on('finish', resolve);
		writer.on('error', reject);
	});
};

(async () => {
	if (
		!process.env ||
		!process.env.FIGMA_API_TOKEN ||
		!process.env.FIGMA_FILE_ID
	) {
		chalk.red.bold('Can\'t find Figma environment variables');
		return;
	}

	const icons = await getUrls(
		await getFigmaFile()
	);

	icons.forEach((icon, index) => {
        spinner.start('Downloading icons from Figma...');

        downloadFile(icon)
            .then(() => {
                if (index + 1 === icons.length)
                    spinner.succeed('Downloaded icons from Figma');
            })
            .catch(error => {
                spinner.fail(`Failed to download ${icon.color}/${icon.name} from Figma: ${error}`);
            });
    });
})();
