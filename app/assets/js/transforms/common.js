module.exports = {
	id: 'ko327t9xuk',
	label: 'Common',
	children: [
		{
			id: '5np6vh8gzd',
			label: 'a/an',
			type: 'prefix',
			re: [
				[['^([aeiou].*)$', 'i'], 'an $1'],
				[['^(.*)$', 'i'], 'a $1'],
			],
		},
	],
}
