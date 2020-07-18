/* eslint-disable no-undef */

import test from 'ava';
import {createIcon} from '../icon';

import ICONS from '../../../dist/icons.json';

test('Throw error for instance of `Icon()` without arguments', t => {
	const error = t.throws(() => {
		createIcon();
	}, {instanceOf: ReferenceError});

	t.is(error.message, 'One or more required arguments not supplied to `Icons`.');
});

test('Throw error for instance of `Icon()` when the `contents` argument is not an object', t => {
	const error = t.throws(() => {
		createIcon('ava', 'fail');
	}, {instanceOf: TypeError});

	t.is(error.message, '`contents` argument passed to `Icons` must be of type object.');
});

test('Throw error when `toSvg()` is called with the `color` parameter as anything but a string', t => {
	const svg = ICONS.ava;
	const ava = createIcon('ava', svg);

	const error = t.throws(() => {
		ava.toSvg(false, {});
	}, {instanceOf: TypeError});

	t.is(error.message, 'The `color` parameter passed to `brands.toSvg()` must be a string.');
});

test('Throw error when `toSvg()` is called with the `attributes` parameter as anything but an object', t => {
	const svg = ICONS.ava;
	const ava = createIcon('ava', svg);

	const error = t.throws(() => {
		ava.toSvg('dark', false);
	}, {instanceOf: TypeError});

	t.is(error.message, 'The `attributes` parameter passed to `brands.toSvg()` must be an object.');
});

test('Create a color icon when `toSvg()` is called with no arguments', t => {
	const svgElement = document.createElement('svg');
	const svgContent = ICONS.ava;
	const ava = createIcon('ava', svgContent);
	const svg = ava.toSvg();

	svgElement.id = 'ava-to-svg';
	svgElement.innerHTML = svg;
	document.body.append(svgElement);

	t.snapshot(document.querySelector('#ava-to-svg').innerHTML);
});
