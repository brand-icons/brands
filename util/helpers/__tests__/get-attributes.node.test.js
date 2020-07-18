import test from 'ava';
import getAttributes from '../get-attributes';

test('`getAttributes.parse()` parses attributes from a string', t => {
	const string = '<div id="ava" data-brand-icon="ava" data-brand-color="dark"></div>';
	const attrs = getAttributes.parse(string);

	t.deepEqual(attrs, {
		'data-brand-icon': 'ava',
		'data-brand-color': 'dark',
		id: 'ava'
	});
});

test('`getAttributes.parse()` handles empty attributes from a string', t => {
	const string = '<div id="ava" empty-attribute data-brand-icon="ava" data-brand-color="dark"></div>';
	const attrs = getAttributes.parse(string);

	t.deepEqual(attrs, {
		'data-brand-icon': 'ava',
		'data-brand-color': 'dark',
		'empty-attribute': '',
		id: 'ava'
	});
});
