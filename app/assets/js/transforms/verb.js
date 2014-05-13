var utils = require('../utils')
var replaceRegexp = utils.replaceRegexp

module.exports = {
	'tense-pp': {
		type: 'postfix',
		label: '·ing',
		fn: function(str) {
			return replaceRegexp([
				// exceptions
				[/^(checkout)$/i, 'checking out'],
				// general rules
				[/(.*[^aeiouy][aeiouy])([bcdfglmnpstvz])$/i, '$1$2$2ing'],
				[/(.*)e$/i, '$1ing'],
				[/(.*)$/i, '$1ing'],
			], str)
		},
	},
}
