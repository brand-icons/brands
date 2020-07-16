import COLOR_MAP from '../default-colors.json';

/**
 * Maps a given color to the corresponding
 * default color values.
 * @param {string} color
 * @returns {string}
 */
const mapColor = color => {
	let mappedColor;

	const DEFAULT_COLORS = ['color', 'dark', 'light'];

	if (!color) {
		mappedColor = 'color';
	}

	if (COLOR_MAP.dark.includes(color.toLowerCase())) {
		mappedColor = 'dark';
	}

	if (COLOR_MAP.light.includes(color.toLowerCase())) {
		mappedColor = 'light';
	}

	return DEFAULT_COLORS.includes(mappedColor) ?
		mappedColor :
		color;
};

export default mapColor;
