import test from 'ava';
import toClass from '../to-class';

test('`toClass() turns an array into a class value`', t => {
	const className = toClass(['foo', 'bar']);

	t.is(className, 'foo bar');
});

test('`toClass() turns an object into a class value`', t => {
	const className = toClass({foo: true, bar: true, baz: false});

	t.is(className, 'foo bar');
});

test('`toClass() turns a number into a class value`', t => {
	const className = toClass(1, 2);

	t.is(className, '1 2');
});

test('`toClass() deduplicates class values`', t => {
	const className = toClass(['foo', 'bar', ['baz']], {foo: true, bar: true, baz: false}, 'baz');

	t.is(className, 'foo bar baz');
});

test('`toClass() ignores objects that are not primitive`', t => {
	const className = toClass({foo: true, bar: true}, new Date(), () => {});

	t.is(className, 'foo bar');
});
