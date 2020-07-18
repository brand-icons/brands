/* eslint-disable no-undef */

import test from 'ava';
import getAttributes from '../get-attributes';

test('`getAttributes.parse()` parses attributes from a DOM element', t => {
	const div = document.createElement('div');
	div.dataset.brandIcon = 'ava';
	div.dataset.brandColor = 'dark';
	div.id = 'ava';

	document.body.append(div);

	const attrs = getAttributes.parse(document.querySelector('#ava'));

	t.deepEqual(attrs, {
		'data-brand-icon': 'ava',
		'data-brand-color': 'dark',
		id: 'ava'
	});
});

test('`getAttributes.parse()` parses attributes from a string', t => {
	const string = '<div id="ava" data-brand-icon="ava" data-brand-color="dark"></div>';
	const attrs = getAttributes.parse(string);

	t.deepEqual(attrs, {
		'data-brand-icon': 'ava',
		'data-brand-color': 'dark',
		id: 'ava'
	});
});

test('`getAttributes.parse()` fails when given an empty string', t => {
	const error = t.throws(() => {
		getAttributes.parse('');
	}, {instanceOf: ReferenceError});

	t.is(error.message, 'The string given to `getAttributes.parse()` is empty.');
});

test('`getAttributes.parse()` fails when given a type other than string or node', t => {
	const types = [[], {}, true, 3];

	// Two assertions per item: `t.throws()` and `t.is()`.
	t.plan(types.length * 2);

	types.forEach(type => {
		const error = t.throws(() => {
			getAttributes.parse(type);
		}, {instanceOf: TypeError});

		t.is(error.message, '`getAttributes.parse()` only accepts strings and nodes. An ' + typeof type + ' was given.');
	});
});

test('`getAttributes.stringify()` returns a string when given a string', t => {
	const attrString = getAttributes.stringify('Wow cool test');

	t.is(attrString, 'Wow cool test');
});

test('`getAttributes.stringify()` returns a string when given array', t => {
	const arrayToString = getAttributes.stringify(['Wow', 'cool', 'test']);

	t.is(arrayToString, 'Wow cool test');
});

test('`getAttributes.stringify()` returns a string when given object', t => {
	const objectToString = getAttributes.stringify({
		'data-brand-icon': 'ava',
		'data-brand-color': 'dark',
		'empty-attribute': ''
	});

	t.is(objectToString, 'data-brand-icon="ava" data-brand-color="dark" empty-attribute');
});

test('`getAttributes.stringify()` fails when given an empty string', t => {
	const error = t.throws(() => {
		getAttributes.stringify('');
	}, {instanceOf: ReferenceError});

	t.is(error.message, 'Cannot stringify undefined.');
});
