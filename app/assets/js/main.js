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
	'wordlist-delete-word': function(ev) {
		var kp = ev.keypath.split('.')
		var idx = kp.splice(-1)
		kp = kp.join('.')
		this.get(kp).splice(idx, 1)
	},
})
