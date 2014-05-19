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
				['^(.*)man$', '$1men'],
				['^(womyn)$', 'wymyn'],
				['^(person)$', 'people'],

				// general rules
				['^(.*)ife$', '$1ives'],
				['^(.*)ex$', '$1ices'],
				['^(.*)([^ou])y$', '$1$2ies'],
				['^(.*)([sc]h|s)$', '$1$2es'],
				['^(.*)$', '$1s'],
			],
		},
	],
}
