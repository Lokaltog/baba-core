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
						[['(.*)ex$', 'i'], '$1exes'],
						[['(.*)([^aeo])y$', 'i'], '$1$2ies'],
						[['(.*)([sc]h|s)$', 'i'], '$1$2es'],
						[['(.*)', 'i'], '$1s'],
					],
				},
				{
					id: '8ikx0opb7j',
					label: 'Present participle',
					tag: '·ing',
					type: 'suffix',
					re: [
						[['(.*[^aeiouy][aeiouy])([bcdfglmnpstvz])$', 'i'], '$1$2$2ing'],
						[['(.*)e$', 'i'], '$1ing'],
						[['(.*)$', 'i'], '$1ing'],
					],
				},
				{
					id: 'lioq5xaxsi',
					label: 'Past',
					tag: '·ed',
					type: 'suffix',
					re: [
						// exceptions
						[['^((re)?set)$', 'i'], '$1'],
						[['^(send)$', 'i'], 'sent'],
						[['^(show)$', 'i'], 'shown'],
						// general rules
						[['(.*[^aeiouy][aeiouy])([bcdfglmpstvz])$', 'i'], '$1$2$2ed'],
						[['(.*)e$', 'i'], '$1ed'],
						[['(.*)y$', 'i'], '$1ied'],
						[['(.*)', 'i'], '$1ed'],
					],
				},
				{
					id: 'q0uri6irxk',
					label: 'Past participle [TODO]',
					tag: '·en',
					type: 'suffix',
					re: [
						[['(.*)$', 'i'], '$1'],
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
						[['(.*)[aeiouy]$', 'i'], '$1ize'],
						[['(.*)$', 'i'], '$1ize'],
					],
				},
				{
					id: 'mxjz59qvra',
					label: 'Agent noun (Latinate)',
					tag: '·or',
					type: 'suffix',
					re: [
						// exceptions
						[['^(.*or)$', 'i'], '$1'], // e.g. author

						// general rules
						[['^(.*?)e?$', 'i'], '$1or'],
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
