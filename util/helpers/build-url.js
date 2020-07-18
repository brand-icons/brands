/**
 * Build the CDN URL.
 * @param {string} color SVG color.
 * @param {string} brand Brand name.
 */
const buildUrl = (color, brand) => {
	const defaultColors = ['color', 'dark', 'light'];
	const baseUri = 'https://cdn.brandicons.org';

	if (color === 'color') {
		return `${baseUri}/${brand}`;
	}

	if (defaultColors.includes(color)) {
		return `${baseUri}/${color}/${brand}`;
	}

	return `${baseUri}/${brand}?color=${encodeURIComponent(color)}`;
};

export {
	buildUrl
};
