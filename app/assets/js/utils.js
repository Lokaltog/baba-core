module.exports = {
	randomItem: function(items) {
		return items[Math.floor(Math.random() * items.length)]
	},
	replaceRegexp: function(str, rules) {
		rules.some(function(filter) {
			var re = new RegExp(filter[0][0], filter[0][1])
			if (str.match(re)) {
				str = str.replace(re, filter[1])
				return true
			}
		})
		return str
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
