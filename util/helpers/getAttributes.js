/**
 * Copyright (c) 2018 Ryan DiMascio.
 * Licensed under the MIT License (MIT), see
 * https://github.com/rimascio/getAttributes
 * 
 * desc.
 * 
 * @returns {Object}
 * 
 * @examples
 * ex.
 */
(function() {
    'use strict';

    /**
     * desc.
     * 
     * @param {String|Node} el - HTML Element
     * @returns {Object}
     * 
     * ex.
     */
    var parse = function(el) {

        // Handles support for strings.
        if (typeof el === 'string') {

            // Check for empty string.
            if (!el) {
                throw new ReferenceError('The string given to `getAttributes.parse()` is empty.');
            }

            // We're not in a browser environment.
            if (typeof document === 'undefined') {
                var elString = el
                    .match(/<(.*?)>/)[1]
                    .split(/( )(?=(?:[^"]|"[^"]*")*$)/)
                    .filter((item) => item.trim());

                elString.splice(0, 1);

                var attributes = {};

                elString.forEach((s) => {
                    var parts = s.split('=');
                    var name = parts[0];
                    var value = parts[1]
                        ? parts[1].replace(/"/g, '')
                        : '';
                  
                    attributes[name] = value;
                });

                return attributes;
            }

            else {
                var elType = el
                    .match(/<(.*?)>/)[1]
                    .split(' ')
                    .splice(0, 1)[0];

                var elDom = new DOMParser().parseFromString(el, 'text/html');
                var newEl = elDom.querySelector(elType);

                return getAttributesFromNode(newEl);
            }
        }

        // Handles support for Nodes.
        else if (typeof el === 'object' && el instanceof Node) {
            return getAttributesFromNode(el);
        }

        // Don't support anything else.
        else {
            throw new TypeError('`getAttributes.parse()` only accepts strings and nodes. An ' + typeof el + ' was given.');
        }
    };

    /**
     * Return stringified element attributes.
     * 
     * @param {Object} object - An object of attributes with format: `{ Name<string>: Value<string> }`.
     * @returns {String}
     * 
     */
    var stringify = function(attrs) {
        if (!attrs) {
            throw new ReferenceError('Cannot stringify ' + attrs);
        }

        if (typeof attrs === 'string') {
            return attrs;
        }

        return Array.isArray(attrs)
            ? attrs.join(' ')
            : Object.keys(attrs)
                .map(attr => {
                    var str = attr;

                    if (attrs[attr]) {
                        str += '="' + attrs[attr] + '"';
                    }

                    return str;
                })
                .join(' ');
    };

    /**
     * Get HTML attributes from an element.
     * @param {Node} el - Element.
     * @returns {Object}
     */
    function getAttributesFromNode(el) {
        if (!el) {
            throw new ReferenceError('Cannot get attributes of undefined');
        }

        var elAttrs = el.attributes;
        var attributes = {};
        var i;

        for (i = 0; i < elAttrs.length; i++) {

            // `elAttrs` is a `NamedNodeMap` (https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap)
            // and the Object.values are `Attr` objects (https://developer.mozilla.org/en-US/docs/Web/API/Attr)
            // so we need tp use the `name` and `value` properties.
            
            var name = elAttrs[i].name;
            var value = elAttrs[i].value;

            attributes[name] = value;
        }

        return attributes;
    };

    var getAttributes = {
        parse,
        stringify
    };

    if (typeof module !== 'undefined' && module.exports) {
		getAttributes.default = getAttributes;
		module.exports = getAttributes;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'get-attributes', consistent with npm package name
		define('get-attributes', [], function () {
			return getAttributes;
		});
	} else {
		window.getAttributes = getAttributes;
	}
})();
