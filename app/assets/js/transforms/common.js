module.exports = {
	id: 'ko327t9xuk',
	label: 'Common',
	children: [
		{
			id: '5np6vh8gzd',
			label: 'a/an',
			type: 'prefix',
			fn: function(str) {
				if (str[0].match(/[aeiou]/)) {
					return 'an ' + str
				}
				return 'a ' + str
			},
		},
	],
}
