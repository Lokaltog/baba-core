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
											ref: '5l2p5uclh2',
											whitespace: false,
										},
										{
											ref: 'wi96d0o1d4',
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
							ref: 'sry8abe5oc',
							transform: [
								'5np6vh8gzd',
							],
							whitespace: false,
						},
						{
							expr: ',',
						},
						{
							ref: '032yds8voe',
						},
						{
							ref: 'msgjejnuya',
							variable: 'subject',
						},
						{
							expr: 'is',
						},
						{
							ref: 'bxvifn0cyu',
							transform: [
								'8ikx0opb7j',
							],
						},
						{
							ref: 'xyo2m72jf9',
							transform: [
								'5np6vh8gzd',
							],
						},
					],
				},
			],
		},
	],
}
