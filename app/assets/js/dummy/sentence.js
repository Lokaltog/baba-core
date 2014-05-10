module.exports = [
	{
		elements: [
			{
				static: true,
				phrase: 'lorem ipsum',
			},
			{
				static: false,
				prefix: [
					{ key: 'a-an', label: 'a/an' },
				],
				word: {
					'class': 'verb',
					group: {
						key: 'git-term',
						label: 'Git term',
					},
				},
				postfix: [
					{ key: 'verb-tense-pp', label: '·ing' },
					{ key: 'pluralize', label: '·s' },
				],
			},
			{
				static: true,
				phrase: 'dolor sit amet',
			},
		]
	},
]
