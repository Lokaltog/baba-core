module.exports = {
	name: 'Test grammar',
	author: 'Kim Silkebækken',
	children: [
		{
			label: 'Noun',
			children: [
				{
					label: 'Subject',
					type: 'wordlist',
					elements: [
						{ expr: 'cat' },
						{ expr: 'dog' },
						{ expr: 'boy' },
						{ expr: 'girl' },
					],
				},
				{
					label: 'Object',
					type: 'wordlist',
					elements: [
						{ expr: 'foot' },
						{ expr: 'stick' },
						{ expr: 'lamp' },
						{ expr: 'phone' },
					],
				},
			],
		},
		{
			label: 'Verb',
			children: [
				{
					label: 'Action',
					type: 'wordlist',
					elements: [
						{ expr: 'eat' },
						{ expr: 'push' },
						{ expr: 'beat' },
						{ expr: 'flog' },
						{ expr: 'shun' },
					],
				},
			],
		},
		{
			label: 'Adjective',
			type: 'wordlist',
			elements: [
				{ expr: 'ugly' },
				{ expr: 'angry' },
				{ expr: 'pathetic' },
				{ expr: 'weird' },
				{ expr: 'funny' },
			],
		},
		{
			label: 'Adverb',
			children: [
				{
					label: 'Alignment',
					children: [
						{
							label: 'Prefix',
							type: 'wordlist',
							elements: [
								{ expr: 'andro' },
								{ expr: 'demi' },
								{ expr: 'gender' },
								{ expr: 'gray' },
								{ expr: 'pomo' },
							],
						},
						{
							label: 'Postfix',
							type: 'wordlist',
							elements: [
								{ expr: 'amorous' },
								{ expr: 'romantic' },
								{ expr: 'platonic' },
								{ expr: 'sensual' },
								{ expr: 'sexual' },
							],
						},
						{
							label: 'Alignment (generated sentence)',
							type: 'sentence',
							export: true,
							elements: [
								[
									{
										path: [3, 0, 0],
										whitespace: false,
									},
									{
										path: [3, 0, 1],
										whitespace: false,
									},
								],
							],
						},
					],
				},
			],
		},
		{
			label: 'Statements (public)',
			type: 'sentence',
			export: true,
			elements: [
				[
					{
						path: [2],
						transform: [
							'common.a-an',
						],
					},
					{
						path: [0, 0],
					},
					{
						expr: 'is',
					},
					{
						path: [1, 0],
						transform: [
							'verb.tense-pp',
						],
					},
					{
						path: [0, 1],
						transform: [
							'common.a-an',
						],
					},
				],
			],
		},
	],
}
