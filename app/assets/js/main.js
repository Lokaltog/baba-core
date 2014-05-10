require('./lib/jquery.autosize.input')

var dummyWordlists = require('./dummy/wordlist')
var dummySentences = require('./dummy/sentence')

var contents = new Ractive({
	el: $('#contents'),
	template: '#contents-template',
	partials: {
		wordlists: $('#wordlist-template').text(),
		sentences: $('#sentence-template').text(),
	},
	data: {
		wordlists: dummyWordlists,
		sentences: dummySentences,
		sortWords: function(words, order) {
			words = words.slice() // clone array
			order = order || 'asc'
			return words.sort(function(a, b) {
				if (order === 'asc') {
					return a.word < b.word ? -1 : 1
				}
				return a.word > b.word ? -1 : 1
			})
		},
	},
})

contents.on({
	'wordlist-add-word': function(ev) {
		var value = ev.node.value.trim().toLowerCase()
		var doPush = true

		// check for duplicates
		ev.context.words.forEach(function(el) {
			if (el.word === value) {
				doPush = false
			}
		})
		if (doPush) {
			ev.context.words.push({
				word: value,
			})
		}
		ev.node.value = ''
	},
	'wordlist-delete-word': function(ev, words) {
		var idx = $.inArray(ev.context, words)
		if (idx < 0) {
			return;
		}
		words.splice(idx, 1)
	},
})
