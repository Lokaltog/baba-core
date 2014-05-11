require('./lib/jquery.autosize.input')

var utils = require('./utils')
var exportGrammar = require('./export')
var dummyWordlists = require('./dummy/wordlist')
var dummySentences = require('./dummy/sentence')
var transforms = {
	// TODO allow users to add external transforms
	common: require('./transforms/common'),
	verb: require('./transforms/verb'),
}

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
        transforms: transforms,

		getKeypath: function(keypath) {
			return this.get(keypath)
		},
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
		classFromIdx: function(classIdx) {
			return this.get(['wordlists', classIdx].join('.'))
		},
		groupFromIdx: function(classIdx, groupIdx) {
			return this.get(['wordlists', classIdx, 'groups', groupIdx].join('.'))
		},
		previewWord: function(group, raw) {
			var word = utils.randomItem(group.words).word

			raw.prefix.forEach(function(pf) {
				word = this.get(pf).fn(word)
			}.bind(this))

			raw.postfix.forEach(function(pf) {
				word = this.get(pf).fn(word)
			}.bind(this))

			return word
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
	'update-keypath': function(ev) {
		this.update(ev.keypath)
    },
})
