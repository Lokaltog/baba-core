module.exports = {
	id: '1nbdszqqro',
	label: 'Verb',
	children: [
		{
			id: '5by5fe3nqu',
			label: 'Tense',
			children: [
				{
					id: '9z7i8y279k',
					label: 'Present',
					tag: '·s',
					type: 'suffix',
					re: [
						[['^(.*[^aeo])y$', 'i'], '$1ies'],
						[['^(.*([sc]h|s|ex))$', 'i'], '$1es'],
						[['^(.*)$', 'i'], '$1s'],
					],
				},
				{
					id: '8ikx0opb7j',
					label: 'Present participle',
					tag: '·ing',
					type: 'suffix',
					re: [
						[['^(.*?)e?$', 'i'], '$1ing'],
					],
				},
				{
					id: 'lioq5xaxsi',
					label: 'Past participle',
					tag: '·ed',
					type: 'suffix',
					re: [
						[['^(.*)y$', 'i'], '$1ied'],
						[['^(.*?)e?$', 'i'], '$1ed'],
					],
				},
				{
					id: 'q0uri6irxk',
					label: 'Participle',
					tag: '·en',
					type: 'suffix',
					re: [
						[['^(.*?)[aeiouy]?$', 'i'], '$1en'],
					],
				},
			],
		},
		{
			id: '61jbjp2yl2',
			label: 'Convert',
			children: [
				{
					id: '9i2oiktftv',
					label: 'Make/become/treat',
					tag: '·ize',
					type: 'suffix',
					re: [
						[['^(.*?)[aeiouy]?$', 'i'], '$1ize'],
					],
				},
				{
					id: 'mxjz59qvra',
					label: 'Agent noun (Latinate)',
					tag: '·or',
					type: 'suffix',
					re: [
						[['^(.*?)(e|or)?$', 'i'], '$1or'],
					],
				},
				{
					id: 'v5o544wj5n',
					label: 'Agent noun (Germanic)',
					tag: '·er',
					type: 'suffix',
					re: [
						[['^(.*?)e?$', 'i'], '$1er'],
					],
				},
			],
		},
	],
}
