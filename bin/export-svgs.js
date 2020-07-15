'use strict';

require('dotenv').config({path: './../.env'});

import fs from 'fs';
import path from 'path';
import ora from 'ora';
import chalk from 'chalk';
import S3Client from 'aws-sdk/clients/s3';

import ICON_DIRS from '../util/icon-dirs.json';

const spinner = ora();

const AWS_MAX_ITEMS = 1000;
const s3 = new S3Client({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_S3_REGION || 'us-east-1'
});

/**
 * Get all objects in an S3 Bucket.
 * @returns {Promise<array>} An array of S3 Bucket objects.
 * @example [
 * 		{
 * 			Key: '/icons/github.svg'
 * 		},
 * 		{
 * 			Key: '/icons/dark/github.svg'
 * 		},
 * 		...
 * ]
 */
const getBucketObjects = () => {
	const parameters = {
		Bucket: process.env.AWS_S3_BUCKET,
		Prefix: 'icons'
	};

	return new Promise((resolve, reject) => {
		/**
		 * Formats a list of S3 Objects.
		 * @param {object} error An AWS error object.
		 * @param {object} data An AWS data object.
		 * @returns {object[]} A list of objects with format `{ Key: <string> }`.
		 */
		const _handleFormatObjects = (error, data) => {
			if (error) {
				reject(error);
			}

			if (data.Contents.length === 0) {
				resolve([]);
			}

			const objects = data.Contents.map(object => (
				{Key: object.Key}
			)
			);

			resolve(objects);
		};

		s3.listObjects(parameters, _handleFormatObjects);
	});
};

/**
 * Empty an S3 Bucket.
 * @param {array} objects An array of objects in the format: `{ Key: <string> }`.
 * @returns {Promise<any>}
 */
const emptyBucket = objects => {
	const parameters = {
		Bucket: process.env.AWS_S3_BUCKET,
		Delete: {
			Objects: objects
		}
	};

	spinner.start('Removing SVGs from S3...');

	return new Promise((resolve, reject) => {
		if (objects.length === 0) {
			resolve();
		}

		const _handleDeleteObjects = async (error, data) => {
			if (error) {
				spinner.fail();
				reject(error);
			}

			if (!data) {
				spinner.succeed();
				resolve();
			}

			/**
			 * If the length of `Deleted` list is the maximum
			 * number of objects allowed by AWS, then there's
			 * most likely more objects in the bucket, so we
			 * need to return a new Promise.
			 */
			if (data.Deleted.length === AWS_MAX_ITEMS) {
				spinner.succeed();
				resolve(
					emptyBucket(await getBucketObjects())
				);
			}

			spinner.succeed();
			resolve();
		};

		s3.deleteObjects(parameters, _handleDeleteObjects);
	});
};

/**
 * Upload objects to S3.
 * @param {object[]} files A list of objects with format: `{ key: <string>, body: <string> }`.
 * @returns {any}
 */
const uploadToS3 = files => {
	spinner.start('Uploading SVGs to S3...');

	files.forEach((file, index) => {
		const parameters = {
			Bucket: process.env.AWS_S3_BUCKET,
			Key: file.key,
			Body: file.body,
			ContentType: 'image/svg+xml'
		};

		s3.putObject(parameters, error => {
			if (error) {
				spinner.fail();
				throw error;
			}

			if (index + 1 === Object.keys(files).length) {
				spinner.succeed();
			}
		});
	});
};

/**
 * Gets all local SVGs to upload.
 * @returns {Promise<object[]>} A list of objects with format: `{ key: <string>, body: <string> }`.
 */
const getFilesToUpload = () => {
	return new Promise(resolve => {
		const files = [];

		Object.keys(ICON_DIRS).forEach(dir => {
			const ICON_DIR = path.join(__dirname, ICON_DIRS[dir]);

			fs
				.readdirSync(ICON_DIR)
				.filter(file => path.extname(file) === '.svg')
				.forEach(file => {
					const icon = `${ICON_DIRS[dir]}/${file}`;
					const iconPath = path.join(__dirname, icon);
					const key = `icons/${dir === 'color' ? '' : `${dir}/`}${file}`;
					const body = fs.readFileSync(iconPath, 'utf-8');

					files.push({key, body});
				});
		});

		resolve(files);
	});
};

(async () => {
	if (
		!process.env ||
		!process.env.AWS_ACCESS_KEY_ID ||
		!process.env.AWS_SECRET_ACCESS_KEY ||
		!process.env.AWS_S3_BUCKET
	) {
		chalk.red.bold('Can\'t find AWS environment variables');
		return;
	}

	try {
		const objectsInBucket = await getBucketObjects();
		await emptyBucket(objectsInBucket);

		const filesToUpload = await getFilesToUpload();
		uploadToS3(filesToUpload);
	} catch (error) {
		throw new Error(error);
	}
})();
