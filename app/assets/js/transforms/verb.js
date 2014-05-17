var utils = require('../utils')
var replaceRegexp = utils.replaceRegexp

module.exports = {
	id: '1nbdszqqro',
	label: 'Verb',
	children: [
		{
			id: '8ikx0opb7j',
			label: '·ing',
			type: 'postfix',
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
	],
}
