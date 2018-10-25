/**
 *  Returns index value of each element of Array object
 */

exports.indexOf = function (arr, obj) {
	var index = -1;
	var keys = Object.keys(obj);

	var result = arr.filter(function (doc, idx) {
		var matched = 0;

		for (var i = keys.length - 1; i >= 0; i--) {
			if (doc[keys[i]] === obj[keys[i]]) {
				matched++;

				if (matched === keys.length) {
					index = idx;
					return idx;
				}
			}
		}
	});

	return index;
}

/**
 * Returns the object which has same value of parameter in the Array
 */

exports.findByParam = function (arr, obj, callback) {
	var index = exports.indexof(arr, obj)
	if (~index && typeof callback === 'function') {
		return callback(undefined, arr[index])
	} else if (~index && !callback) {
		return arr[index]
	} else if (!~index && typeof callback === 'function') {
		return callback('not found')
	}
}