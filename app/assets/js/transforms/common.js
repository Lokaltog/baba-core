module.exports = {
	id: 'ko327t9xuk',
	label: 'Common',
	children: [
		{
			id: '5np6vh8gzd',
			label: 'Prefix a/an',
			tag: 'a/an',
			type: 'prefix',
			transforms: [
				['^([aeiou].*)$', 'an $1'],
				['^(.*)$', 'a $1'],
			],
		},
	],
}
