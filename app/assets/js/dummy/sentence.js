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
				classIdx: 0,
				groupIdx: 0,
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
