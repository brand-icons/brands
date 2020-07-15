/**
 * Stringifies an object of HTML5 attributes.
 * @param {object} attrs - Object of SVG attributes.
 */
const attrsToString = (attrs) => Object.keys(attrs)
	.map(key => `${key}="${attrs[key]}"`)
    .join(' ');

export default attrsToString;
