module.exports = {
	id: 'zw18sa6daq',
	label: 'Noun',
	children: [
		{
			id: '5d5kbm8y9k',
			label: 'Plural',
			tag: '·s',
			type: 'suffix',
			re: [
				// exceptions
				[['(.*)man$', 'i'], '$1men'],
				[['(womyn)$', 'i'], 'wymyn'],
				[['(person)$', 'i'], 'people'],

				// general rules
				[['(.*)ife$', 'i'], '$1ives'],
				[['(.*)ex$', 'i'], '$1ices'],
				[['(.*)([^ou])y$', 'i'], '$1$2ies'],
				[['(.*)([sc]h|s)$', 'i'], '$1$2es'],
				[['(.*)', 'i'], '$1s'],
			],
		},
	],
}
