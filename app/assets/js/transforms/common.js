module.exports = {
	'a-an': {
		type: 'prefix',
		label: 'a/an',
		fn: function(str) {
			if (str[0].match(/[aeiou]/)) {
				return 'an ' + str
			}
			return 'a ' + str
		},
	},
}
