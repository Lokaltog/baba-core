require('./lib/jquery.autosize.input')

var contents = new Ractive({
	el: $('#contents'),
	template: '#contents-template',
	partials: {
		wordlists: $('#wordlist-template').text(),
		sentences: $('#sentence-template').text(),
	},
	data: {
		// Word lists
		wordlist: [
			{
				'class': 'noun',
				group: 'git term',
				words: [
					{ word: 'lorem' },
					{ word: 'ipsum' },
				]
			},
			{
				'class': 'verb',
				group: 'something else',
				words: [
					{ word: 'dolor' },
				]
			},
		],
		// Sentences
		sentences: [
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
		],
	},
})

// handle sentence builder
$('.builder-sentence').sortable({
	handle: '.handle',
})
