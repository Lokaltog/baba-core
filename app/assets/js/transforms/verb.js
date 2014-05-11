var utils = require('../utils')

module.exports = {
	'tense-pp': {
		type: 'postfix',
		class: 'postfixVerbTensePP',
		label: '·ing',
		fn: function(str) {
			return utils.replaceRegexp([
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
