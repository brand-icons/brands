/**
 * Add support for NodeList.forEach().
 * https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach
 */
/* eslint-disable no-undef */
(function () {
	if (!window) {
		return;
	}

	if (typeof window === undefined) {
		return;
	}

	if (window.NodeList && !window.NodeList.prototype.forEach) {
		window.NodeList.prototype.forEach = Array.prototype.forEach;
	}
})();
/* eslint-enable no-undef */
