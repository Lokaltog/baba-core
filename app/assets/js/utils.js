module.exports = {
	randomItem: function(items) {
		return items[Math.floor(Math.random() * items.length)]
	},
	replaceRegexp: function(rules, str) {
		var ret
		rules.some(function(filter) {
			if (str.match(filter[0])) {
				ret = str.replace(filter[0], filter[1])
				return true
			}
		})
		return ret
	},
	objPropertyPath: function(obj, path, silent) {
		var arr = path.split('.')
		while (arr.length && (obj = obj[arr.shift()])) {}
		if (typeof obj === 'undefined' && !silent) {
			throw 'Undefined property path: ' + path
		}
		return obj
	},
}
