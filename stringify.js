/**
 * A polyfill for JSON.stringify objects in JavaScript.
 * Copyright © 2015 Matthew Fornaciari (mattforni@gmail.com)
 */

// If JSON is supported by the browser, simply use it
if (JSON && JSON.stringify) { return; }

// Otherwise define a browser agnostic implementation
if (JSON === 'undefined') { JSON = {}; }
JSON.stringify = function(object) {
    var type = typeof(object);

    // If the object is a simple data type, just return a string
    if (type !== 'object' || object === null) { return String(object); }

    // Otherwise recursively handle Array or Object
    var isArray = object && object.constructor == Array;
    var json = [];
    for (var index in object) {
        if (object.hasOwnProperty(index)) {
            var value = object[index];
            var type = typeof(value);

            // If the type of the current value is an object, recurse
            if (type === 'object' && value !== null) {
                value = serialize(value);
            } else {
                value = String(value);
            }

            json.push((isArray ? "" : "'"+index+"':") + String(value));
        }
    }

    return (isArray ? "[" : "{") + String(json) + (isArray ? "]" : "}");
};
