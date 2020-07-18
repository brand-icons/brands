import test from 'ava';
import brands from '..';

test('`brands.render() should throw error in node environments`', t => {
	const error = t.throws(() => {
		brands.render();
	}, {instanceOf: ReferenceError});

	t.is(error.message, '`brands.render()` only works in a browser environment.');
});
