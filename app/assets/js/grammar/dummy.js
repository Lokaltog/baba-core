module.exports = {
	label: 'Test grammar',
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
						{ expr: 'food' },
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
			label: 'Statements (public)',
			children: [
				{
					label: 'Test sentence',
					type: 'sentence',
					elements: [
						{
							expr: 'the',
						},
						{
							path: 'adjective',
						},
						{
							path: 'noun.subject',
						},
						{
							expr: 'is',
						},
						{
							path: 'verb.action',
							postfix: [
								'transforms.verb.tense-pp',
							],
						},
						{
							path: 'noun.object',
							prefix: [
								'transforms.common.a-an',
							],
						},
					],
				},
			],
		},
	],
}
