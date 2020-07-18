/* eslint-disable no-undef */

import test from 'ava';
import brands from '..';

test('`brands.render()` replaces a `<div>` element with an SVG', t => {
	const div = document.createElement('div');
	div.id = 'ava';
	div.dataset.brandIcon = 'ava';
	div.dataset.brandColor = 'dark';
	document.body.append(div);

	brands.render();

	const svgContent = document.querySelector('#ava').innerHTML;

	t.snapshot(svgContent);
});

test('`brands.render()` replaces a `<div>` element with an SVG using a light color', t => {
	const div = document.createElement('div');
	div.id = 'ava-light';
	div.dataset.brandIcon = 'ava';
	div.dataset.brandColor = 'light';
	document.body.append(div);

	brands.render();

	const svgContent = document.querySelector('#ava-light').innerHTML;

	t.snapshot(svgContent);
});

test('`brands.render()` replaces a `<div>` element with an SVG using custom colors', t => {
	const div = document.createElement('div');
	div.id = 'ava-custom';
	div.dataset.brandIcon = 'ava';
	div.dataset.brandColor = '#6f42c1';
	document.body.append(div);

	brands.render();

	const svgContent = document.querySelector('#ava-custom').innerHTML;

	t.snapshot(svgContent);
});

test('`brands.render()` overrides all arguments with the `data-brand-color` attribute', t => {
	const div = document.createElement('div');
	div.id = 'ava-color-attribute';
	div.dataset.brandIcon = 'adobe';
	div.dataset.brandColor = 'color';
	document.body.append(div);

	brands.render('dark');

	const svgContent = document.querySelector('#ava-color-attribute').outerHTML;

	t.is(svgContent, '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="brand-icon adobe" height="24" width="24" id="ava-color-attribute"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 1h8L0 23V1zm16 0h8v22L16 1zm1 22h-3l-1.5-4h-4l1-3L12 9l5 14z" fill="red"></path></svg>');
});

test('`brands.render()` adds classes using the attribute argument', t => {
	const div = document.createElement('div');
	div.id = 'ava-class-attribute';
	div.dataset.brandIcon = 'adobe';
	document.body.append(div);

	brands.render('dark', {
		class: 'foo'
	});

	const svgContent = document.querySelector('#ava-class-attribute').outerHTML;

	t.is(svgContent, '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="brand-icon adobe foo" height="24" width="24" id="ava-class-attribute"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 1h8L0 23V1zm16 0h8v22L16 1zm1 22h-3l-1.5-4h-4l1-3L12 9l5 14z" fill="#000"></path></svg>');
});

test('The `src` of an `<img>` element is replaced with the CDN url (brand and color)', t => {
	const img = document.createElement('img');
	img.id = 'ava-dark';
	img.dataset.brandIcon = 'ava';
	img.dataset.brandColor = 'dark';
	document.body.append(img);

	brands.render();

	const imgSrc = document.querySelector('#ava-dark').src;

	t.is(imgSrc, 'https://cdn.brandicons.org/dark/ava');
});

test('The `src` of an `<img>` element is replaced with the CDN url (brand)', t => {
	const img = document.createElement('img');
	img.id = 'ava-color';
	img.dataset.brandIcon = 'ava';
	img.dataset.brandColor = 'color';
	document.body.append(img);

	brands.render();

	const imgSrc = document.querySelector('#ava-color').src;

	t.is(imgSrc, 'https://cdn.brandicons.org/ava');
});

test('The `src` of an `<img>` element is replaced with the CDN url (brand and custom color)', t => {
	const img = document.createElement('img');
	img.id = 'ava-custom-image';
	img.dataset.brandIcon = 'ava';
	img.dataset.brandColor = '#6f42c1';
	document.body.append(img);

	brands.render();

	const imgSrc = document.querySelector('#ava-custom-image').src;

	t.is(imgSrc, 'https://cdn.brandicons.org/ava?color=%236f42c1');
});
