module.exports = {
	'a-an': {
		type: 'prefix',
		class: 'prefixAn',
		label: 'a/an',
		fn: function(str) {
			if (str[0].match(/[aeiou]/)) {
				return 'an ' + str
			}
			return 'a ' + str
		},
	},
}
