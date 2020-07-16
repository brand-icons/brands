/**
 * Copyright (c) 2018 Ryan DiMascio.
 * Licensed under the MIT License (MIT), see
 * https://ryan.dimasc.io/toClass
 *
 * Inspired by classnames by Jed Watson:
 * https://github.com/JedWatson/classnames
 *
 *
 *
 * @param  {...any} args - Class names.
 * @returns {string}
 *
 * @examples
 * toClass('foo', 'bar', 'foo'); // => 'foo bar'
 * toClass(['foo', 'bar', false]); // => 'foo bar'
 * toClass('foo', {bar: true}); // => 'foo bar'
 * toClass({foo: true}, {bar: true}); // => 'foo bar'
 * toClass({foo: true, bar: false}); // => 'foo'
 * toClass({foo: true, bar: true}, [baz, bar], 'foo'); // => 'foo bar baz'
 */
const toClass = (...args) => {
	const CLASS_NAMES = new Set();

	/**
     * Add a list of strings to `CLASS_NAMES`.
     * @param {array} classes - A list of classes.
     */
	const addClasses = classes => {
		classes.forEach(name => {
			if (

				/* eslint-disable-next-line no-new-object */
				classes === new Object(classes) &&
                !Array.isArray(classes) &&
                !classes[name]
			) {
				return;
			}

			CLASS_NAMES.add(name);
		});
	};

	args.forEach(arg => {
		if (!arg) {
			return;
		}

		const argType = typeof arg;

		if (argType === 'string') {
			addClasses(arg.split(' '));
		} else if (argType === 'number') {
			CLASS_NAMES.add(arg.toString());
		} else if (Array.isArray(arg)) {
			addClasses(arg.flat());
		} else if (
			argType === 'object' &&

			/* eslint-disable-next-line no-new-object */
            arg === new Object(arg)
		) {
			addClasses(Object.keys(arg));
		}
	});

	return [...CLASS_NAMES].join(' ');
};

export default toClass;
