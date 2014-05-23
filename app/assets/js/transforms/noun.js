module.exports = {
	id: 'zw18sa6daq',
	label: 'Noun',
	children: [
		{
			id: '5d5kbm8y9k',
			label: 'Plural',
			tag: 's',
			type: 'suffix',
			transforms: [
				['^(.*)ife$', '$1ives'], // knife, life
				['^(.*)([^ou])y$', '$1$2ies'], // fry, try
				['^(.*((tc|s)h|[sx]))$', '$1es'], // batch, bash, bass, sex
				['^(.*)$', '$1s'],
			],
		},
	],
}
