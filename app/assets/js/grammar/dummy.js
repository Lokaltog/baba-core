module.exports = {
	name: 'Test grammar',
	author: 'Kim Silkebækken',
	children: [
		{
			id: 'cu4aes6zbm',
			label: 'Noun',
			children: [
				{
					id: 'msgjejnuya',
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
					id: 'xyo2m72jf9',
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
			id: '0oevdiptqy',
			label: 'Verb',
			children: [
				{
					id: 'bxvifn0cyu',
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
			id: 'sry8abe5oc',
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
			id: 'a2uxbog2vm',
			label: 'Adverb',
			children: [
				{
					id: 'd0txfss1wf',
					label: 'Alignment',
					children: [
						{
							id: '5l2p5uclh2',
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
							id: 'wi96d0o1d4',
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
							id: '032yds8voe',
							label: 'Alignment (generated sentence)',
							type: 'sentence',
							export: true,
							elements: [
								{
									sentence: [
										{
											path: [3, 0, 0],
											whitespace: false,
										},
										{
											path: [3, 0, 1],
											whitespace: false,
										},
									],
								},
							],
						},
					],
				},
			],
		},
		{
			id: 'gwg2kt1b35',
			label: 'Statements (public)',
			type: 'sentence',
			export: true,
			elements: [
				{
					sentence: [
						{
							path: [2],
							transform: [
								'common.a-an',
							],
						},
						{
							path: [0, 0],
							variable: 'subject',
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
				},
			],
		},
	],
}
