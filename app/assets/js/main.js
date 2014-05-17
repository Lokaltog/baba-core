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
	data: {
		open: false,
	},
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
		removeElement: function(element) {
			this.elements.$remove(element)
		},
	},
})

Vue.component('container-sentence', {
	template: '#container-sentence-template',
	methods: {
		removeElement: function(element) {
			this.elements.$remove(element)
		},
	},
})

Vue.component('container-sentence-expr', {
	template: '#container-sentence-expr-template',
})

Vue.component('container-sentence-path', {
	template: '#container-sentence-path-template',
	methods: {
		filterTransforms: function(transforms, type) {
			var ret = []
			transforms.forEach(function(value) {
				var tf = this.$get('transforms.' + value)
				if (tf.type === type) {
					ret.push(tf)
				}
			}.bind(this))
			return ret
		},
	},
})

Vue.component('update-element-contextmenu', {
	template: '#update-element-contextmenu-template',
	methods: {
		updateElement: function(element, keypath) {
			element.transform = []
			element.path = keypath
		},
	},
})

Vue.component('add-element-contextmenu', {
	template: '#add-element-contextmenu-template',
	methods: {
		addElement: function(elements, keypath) {
			if (!this.model.type) {
				return
			}
			elements.push({
				path: keypath,
			})
		},
	},
})

function getExportedNodes(node) {
	var ret = []
	if (node.children) {
		node.children.forEach(function(child) {
			ret = ret.concat(getExportedNodes(child))
		})
	}
	if (node.export === true) {
		ret.push(node)
	}
	return ret
}

function getKeypaths(node, keypath) {
	var ret = []
	keypath = keypath || []
	if (node.children) {
		var index = 0
		node.children.forEach(function(child) {
			ret = ret.concat(getKeypaths(child, keypath.concat([index++])))
		})
	}
	if (keypath && node.label) {
		ret.push([node, keypath])
	}
	return ret
}

var vm = new Vue({
	el: '#contents',
	data: {
		grammar: grammar,
		transforms: transforms,
		exported: [],
		keypaths: {},
	},
	created: function() {
		this.$watch('grammar', function() {
			// walk the grammar tree and detect any exported nodes
			this.exported = getExportedNodes(this.grammar)

			// store keypaths for all nodes
			// we can't store keypaths in the grammar, as any updates done here
			// will trigger the watcher again and end up in an infinite loop
			this.keypaths = getKeypaths(this.grammar)
		})
	},
	methods: {
		getKeypath: function(node) {
			// search for a keypath for a node
			// not particularily effective as we have to examine each element in the keypath array
			// TODO improve keypath storage
			if (!Array.isArray(this.keypaths)) {
				// keypaths may not have been initialized yet
				return ''
			}
			var foundKp
			this.keypaths.some(function(kp) {
				if (kp[0] === node) {
					foundKp = kp[1]
					return true
				}
			})
			return foundKp
		},
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
		getGrammarComponentPreview: function(searchPath, transforms) {
			var elements = this.getGrammarNode(searchPath).splice(-1)[0].elements
			var expr = utils.randomItem(elements)
			if (typeof expr === 'undefined') {
				return '<<empty word list>>'
			}
			expr = expr.expr
			var p

			for (p in transforms) {
				if (transforms.hasOwnProperty(p)) {
					expr = this.$get('transforms.' + transforms[p]).fn(expr)
				}
			}

			return expr
		},
		exportRawGrammar: function() {
			var data = JSON.stringify(this.$root.grammar)
			window.open('data:application/json;' +
			            (window.btoa ? 'base64,' + btoa(data)
			             : data))
		},
		exportGrammarGenerator: function() {
			var data = exportGrammar(this.$root.grammar, transforms)
			window.open('data:application/json;' +
			            (window.btoa ? 'base64,' + btoa(data)
			             : data))
		},
	},
})

// handle context menus
$('#contents').on('click', '.contextmenu-trigger', function(ev) {
	ev.stopPropagation()

	if ($(this).siblings('.contextmenu').hasClass('active')) {
        $('.contextmenu').removeClass('active')
		return
	}

	$('.contextmenu').removeClass('active')
	$(this).siblings('.contextmenu').addClass('active')
})
$('#contents').on('click', '.contextmenu .label', function(ev) {
	ev.stopPropagation()

	$(this).parents('.contextmenu').first().find('.contextmenu').removeClass('active')
	$(this).parents('.contextmenu').addClass('active')
	$(this).siblings('.contextmenu').addClass('active')
})
$('body').on('click', function() {
	$('.contextmenu').removeClass('active')
})
