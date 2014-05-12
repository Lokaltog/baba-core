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
		transforms: transforms,
	},
	methods: {
		getGrammarNode: function(searchPath) {
			var path = searchPath.slice(0) // clone path array

			function getComponents(node) {
				var idx = path.shift()
				var currentNode = node[idx]
				var components = [currentNode]
				if (currentNode.children) {
					components = components.concat(getComponents(currentNode.children))
				}
				return components
			}

			return getComponents(this.$root.grammar.children)
		},
		getGrammarComponents: function(searchPath) {
			return this.getGrammarNode(searchPath).map(function(el) {
				return {
					label: el.label,
					key: S(el.label).slugify().toString(),
				}
			})
		},
		getGrammarPreview: function(searchPath, prefix, postfix) {
			var elements = this.getGrammarNode(searchPath).splice(-1)[0].elements
			var expr = utils.randomItem(elements)
			if (typeof expr === 'undefined') {
				return '<<<empty word list>>>'
			}
			expr = expr.expr
			var p

			for (p in prefix) {
				if (prefix.hasOwnProperty(p)) {
					expr = this.$get(prefix[p]).fn(expr)
				}
			}
			for (p in postfix) {
				if (postfix.hasOwnProperty(p)) {
					expr = this.$get(postfix[p]).fn(expr)
				}
			}

			return expr
		},
	},
})
