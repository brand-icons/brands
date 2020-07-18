import test from 'ava';
import mapColor from '../map-color';

test('Falsey value passed to `mapColor()` returns `color`', t => {
	const emptyColor = mapColor('');

	t.is(emptyColor, 'color');
});

test('Dark colors passed to `mapColor()` returns `dark`', t => {
	const darkColors = ['black', '#000', '#000000', '000', '000000'];
	t.plan(darkColors.length);

	darkColors.forEach(color => {
		t.is(mapColor(color), 'dark');
	});
});

test('Light colors passed to `mapColor()` returns `light`', t => {
	const lightColors = ['white', '#FFF', '#FFFFFF', 'FFF', 'FFFFFF', '#fff', '#ffffff', 'fff', 'ffffff'];
	t.plan(lightColors.length);

	lightColors.forEach(color => {
		t.is(mapColor(color), 'light');
	});
});

test('Custom color passed to `mapColor()` returns custom color', t => {
	const customColor = mapColor('#6f42c1');

	t.is(customColor, '#6f42c1');
});
