var utils = require('./utils')
var exportGrammar = require('./export')
var grammar = require('./grammar/dummy')
var transforms = [
	require('./transforms/common'),
	require('./transforms/verb'),
]

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
	methods: {
		filterTransforms: function(transformList, type) {
			var ret = []
			transformList.forEach(function(path) {
				var tf = findNode(transforms, path)
				if (tf.type === type) {
					ret.push(tf)
				}
			})
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

function generateId() {
	return Math.random().toString(36).substr(2, 10)
}

function findNode(obj, path) {
	path = path.slice(0) // duplicate search path array
	var key = path.shift()
	for (var node in obj) {
		if (obj.hasOwnProperty(node)) {
			if (obj[node].id === key) {
				if (!path.length) {
					return obj[node]
				}
				return findNode(obj[node].children, path)
			}
		}
	}
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
		generateId: generateId,
		findNode: findNode,
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

			function getComponents(obj) {
				var id = path.shift()
				var components = []
				for (var node in obj) {
					if (obj.hasOwnProperty(node)) {
						if (obj[node].id === id) {
							components = [obj[node]]
							if (obj[node].children) {
								components = components.concat(getComponents(obj[node].children))
							}
						}
					}
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
		getGrammarComponentPreview: function(element) {
			var elements = this.getGrammarNode(element.path).splice(-1)[0].elements
			var item = utils.randomItem(elements)
			if (typeof item === 'undefined') {
				return '<<empty word list>>'
			}
			expr = item.expr

			// apply transforms
			if (element.transform) {
				element.transform.forEach(function(path) {
					var tf = findNode(transforms, path)
					expr = tf.fn(expr)
				})
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
		addWordlist: function(model) {
			model.type = 'wordlist'
		},
		addSentence: function(model) {
			model.type = 'sentence'
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
