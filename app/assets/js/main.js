require('./lib/jquery.autosize.input')

var utils = require('./utils')
var exportGrammar = require('./export')
var grammar = require('./grammar/dummy')
var transforms = {
	// TODO allow users to add external transforms
	common: require('./transforms/common'),
	verb: require('./transforms/verb'),
}

Vue.component('grammar', {
	template: '#grammar-template',
})

Vue.component('container-wordlist', {
	template: '#container-wordlist-template',
	methods: {
		addPhrase: function(ev) {
			var value = ev.target.value.trim().toLowerCase()

			// check for duplicates
			if (!this.$data.elements.some(function(el) {
				return el.expr === value
			})) {
				this.$data.elements.push({
					expr: value,
				})
			}

			ev.target.value = ''
		},
		deletePhrase: function(obj) {
			this.$data.elements.$remove(obj.$data)
		},
	},
})

Vue.component('container-sentence', {
	template: '#container-sentence-template',
})

Vue.component('container-sentence-expr', {
	template: '#container-sentence-expr-template',
})

Vue.component('container-sentence-path', {
	template: '#container-sentence-path-template',
})

var vm = new Vue({
	el: '#contents',
	data: {
		grammar: grammar,
	},
	methods: {
		transforms: transforms,
	},
})
