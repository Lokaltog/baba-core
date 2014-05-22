// dummy grammar ID: 948a562c40cc36de62ca

var utils = require('./utils')
var storage = require('./storage')
var exportGrammar = require('./export')
var catchphraseGenerator = require('./generators/catchphrase.generator.js')
var transforms = {
	children: [
		// common
		require('./transforms/builtin'),
		require('./transforms/common'),

		// word classes
		require('./transforms/adjective'),
		require('./transforms/noun'),
		require('./transforms/verb'),
	]
}

// catchprase generator
$('.catchphrase .text')
	.text(catchphraseGenerator.catchphrase() + '!')
	.click(function() {
		$(this).text(catchphraseGenerator.catchphrase() + '!')
	})

// vue util functions
function getExportedNodes(node) {
	var ret = []
	if (node.children && node.children.length) {
		node.children.forEach(function(child) {
			ret = ret.concat(getExportedNodes(child))
		})
	}
	if (node.export === true) {
		ret.push(node)
	}
	return ret
}

function getNodeCache() {
	var ret = {}
	function getNodes(node, parent) {
		if (node.id) {
			ret[node.id] = { node: node, parent: ret[parent.id] }
		}
		if (node.children && node.children.length) {
			node.children.forEach(function(child) {
				getNodes(child, node)
			})
		}
	}
	for (var i = 0; i < arguments.length; i += 1) {
		getNodes(arguments[i])
	}
	return ret
}

function addContextSubmenu(node, parent) {
	var id = 'node:' + node.id
	var tag = node.tag
	parent[id] = { name: node.label }
	if (tag) {
		if (node.type) {
			tag = node.type === 'prefix' ? tag + '·' : '·' + tag
		}
		parent[id].name = '<span class="tag-container"><span class="label">' + node.label + '</span> <span class="tag">' + tag + '</span></span>'
	}
	if (node.children) {
		var children = node.children.slice(0)
		parent[id].items = {}
		children.sort(function (a, b) {
			if (a.label > b.label) {
				return 1
			}
			if (a.label < b.label) {
				return -1
			}
			return 0
		})
		children.forEach(function(el) {
			addContextSubmenu(el, parent[id].items)
		})
	}
}

function generateId() {
	return Math.random().toString(36).substr(2, 10)
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
		addString: function(ev) {
			var value = ev.target.value.trim().toLowerCase()

			// check for duplicates
			if (!this.$data.elements.some(function(el) {
				return el === value
			})) {
				this.$data.elements.push(value)
			}

			// sort word list alphabetically
			this.$data.elements.sort()

			ev.target.value = ''
		},
	},
})

Vue.component('container-sentence', {
	template: '#container-sentence-template',
	methods: {
		filterTransforms: function(transformList, type) {
			var ret = []
			var nc = this.$root.nodeCache

			;(transformList || []).forEach(function(ref) {
				if (!nc.hasOwnProperty(ref)) {
					return
				}
				var tf = nc[ref].node
				if (tf.type === type) {
					ret.push(tf)
				}
			})

			return ret
		},
		updatePreview: function(model) {
			// add and remove a property to force an update
			// this will update it twice, but at least it works
			model.$add('preview', true)
			model.$delete('preview')
		},
	},
})

Vue.component('transforms', {
	template: '#transforms-template',
	data: {
		open: false,
	},
})

var vm = new Vue({
	el: 'body',
	data: {
		grammar: storage.load(),
		transforms: transforms,
		nodeCache: {},
		exported: [],
		exportType: 'module',
		tab: 'grammar',
	},
	lazy: true,
	created: function() {
		function createNodeCache(obj) {
			// store flat cache of all nodes with parents
			var nodeCache = getNodeCache(obj.grammar, obj.transforms)
			for (var n in nodeCache) {
				if (nodeCache.hasOwnProperty(n)) {
					obj.nodeCache[n] = nodeCache[n]
				}
			}
		}
		createNodeCache(this)

		function updateSlugs(obj) {
			obj.exportedSlugs = obj.exported.map(function(el) {
				return S(el.label).slugify().toString()
			}).sort()
			obj.grammarNameSlug = S(obj.grammar.name).slugify().toString()
		}
		updateSlugs(this)

		this.$watch('transforms', function(grammar) {
			console.debug('Transforms watcher triggered')

			createNodeCache(this)

			// make sure any new inputs are autosized
			$('input[data-autosize-input]').autosizeInput()

			// TODO save in storage below
		})

		this.$watch('grammar', function(grammar) {
			console.debug('Grammar watcher triggered')

			// walk the grammar tree and detect any exported nodes
			this.exported = getExportedNodes(grammar)

			// reset the exported preview generator every time the grammar changes
			this.exportedGenerator = null
			$('#generator-preview-contents').text('')
			$('.generator-preview-buttons li').removeClass('active')

			createNodeCache(this)
			updateSlugs(this)

			// make sure any new inputs are autosized
			$('input[data-autosize-input]').autosizeInput()

			// backup grammar in local storage
			storage.save(this)
		})
	},
	methods: {
		generateId: generateId,
		sortChildren: function(model) {
			model.children.sort(function (a, b) {
				if (a.label > b.label) {
					return 1
				}
				if (a.label < b.label) {
					return -1
				}
				return 0
			})
		},
		swapItems: function(arr, index, newIndex) {
			var tmp = arr[index]
			arr.$set(index, arr[newIndex])
			arr.$set(newIndex, tmp)
		},
		removeGroup: function(model, parent) {
			parent.children.$remove(model)
			storage.save(this.$root) // force save
		},
		previewGenerator: function(ev, label) {
			var slug = S(label).slugify().toString()
			var container = $('#generator-preview-contents')

			if (!this.exportedGenerator) {
				console.debug('Grammar changed, recompiling')

				var exportedGenerator = exportGrammar(vm, 'module', false)
				var context = {}

				new Function(exportedGenerator).call(context)

				this.exportedGenerator = context.Baba
			}

			$('.generator-preview-buttons li').removeClass('active')
			$(ev.target).addClass('active')
			container.text(this.exportedGenerator[slug]())
		},
		getGrammarNode: function(searchPath) {
			var node = this.nodeCache[searchPath]
			if (typeof node === 'undefined') {
				return []
			}
			var searchNode = node
			var components = [node.node]
			while (searchNode.parent) {
				searchNode = searchNode.parent
				components.unshift(searchNode.node)
			}

			return components
		},
		getGrammarComponents: function(searchPath) {
			var nodes = this.getGrammarNode(searchPath)
			if (!nodes.length) {
				return [{
					label: '<<missing word>>',
					key: '',
				}]
			}
			return nodes.map(function(el) {
				return {
					label: el.label,
					key: S(el.label).slugify().toString(),
				}
			})
		},
		getGrammarComponentPreview: function(node) {
			var cachedNode = this.nodeCache[node.ref]
			if (typeof cachedNode === 'undefined') {
				return '<<invalid reference>>'
			}
			var item = utils.randomItem(cachedNode.node.elements)
			if (typeof item === 'undefined') {
				return '<<empty word list>>'
			}

			// apply transforms
			if (node.transform) {
				node.transform.forEach(function(transform) {
					var node = this.nodeCache[transform].node
					item = utils.applyTransformArray(item, node.transforms)
				}.bind(this))
			}

			return item
		},
		getRawGrammar: function() {
			// sanitize grammar
			// remove disallowed keys
			// remove empty properties
			var grammar = {}
			var allowedKeys = [
				'children', 'elements', 'type', 'label', 'comment',
				'id', 'str', 'ref', 'variable', 'sentence', 'transform', 'transforms',
				'name', 'author', 'export', 'whitespace',
			]

			function sanitizeGrammar(node, parent) {
				for (var key in node) {
					if (node.hasOwnProperty(key)) {
						if (node[key] === '' || node[key] === [] || node[key] === {}) {
							continue
						}

						if (Array.isArray(node[key])) {
							parent[key] = []
							node[key].forEach(function(value, idx) {
								if (typeof value === 'object') {
									parent[key][idx] = {}
									sanitizeGrammar(value, parent[key][idx])
								}
								else if (typeof value === 'string') {
									parent[key][idx] = value
								}
							})
						}
						else if (allowedKeys.indexOf(key) > -1) {
							parent[key] = node[key]
						}
					}
				}
			}
			sanitizeGrammar(this.$root.grammar, grammar)

			return grammar
		},
		exportRawGrammar: function() {
			var grammar = this.getRawGrammar()
			var slug = S(this.$root.grammar.name).slugify().toString()
			var data = JSON.stringify(grammar, undefined, '\t')

			$.magnificPopup.open({
				mainClass: 'mfp-transition-zoom-in',
				removalDelay: 300,
				preloader: false,
				closeBtnInside: false,
				callbacks: {
					open: function() {
						$('#popup-export-grammar textarea').text(data)
						$('#popup-export-grammar button.download').click(function() {
							var blob = new Blob([data], { type: 'application/json' })
							saveAs(blob, slug + '.grammar.json')
						})
						setTimeout(function() {
							$('#popup-export-grammar textarea').select()
						}, 100)
					}
				},
				items: {
					type: 'inline',
					src: '#popup-export-grammar',
				},
			})
		},
		exportGrammarGenerator: function() {
			var slug = S(this.$root.grammar.name).slugify().toString()
			var data = exportGrammar(vm, this.$root.exportType, true)

			$.magnificPopup.open({
				mainClass: 'mfp-transition-zoom-in',
				removalDelay: 300,
				preloader: false,
				closeBtnInside: false,
				callbacks: {
					open: function() {
						$('#popup-export-grammar textarea').text(data)
						$('#popup-export-grammar button.download').click(function() {
							var blob = new Blob([data], { type: 'application/javascript' })
							saveAs(blob, slug + '.js')
						})
						setTimeout(function() {
							$('#popup-export-grammar textarea').select()
						}, 100)
					}
				},
				items: {
					type: 'inline',
					src: '#popup-export-grammar',
				},
			})
		},
		addChild: function(node) {
			if (!node.children) {
				node.$add('children', [])
				node.children = []
			}
			node.children.push({
				id: generateId(),
			})
		},
		addWordlist: function(model) {
			model.id = generateId()
			model.type = 'wordlist'
			model.elements = []
		},
		addSentence: function(model) {
			model.id = generateId()
			model.type = 'sentence'
			model.elements = []
		},
		updateTransformFunction: function(ev, transforms, idx) {
			try {
				transforms[idx] = Function('return (' + $(ev.target).val() + ')')()
				this.testTransform(ev, transforms)
			}
			catch (e) {
				popupAlert('An error occured while parsing the transform function: <p><strong>' + e + '</strong></p>', 'error')
			}
		},
		updateTransformRegex: function(ev, transforms, node, idx) {
			node[idx] = $(ev.target).val()
			this.testTransform(ev, transforms)
		},
		addTransformRegex: function(transform) {
			if (!transform.transforms) {
				transform.$add('transforms', [])
				transform.transforms = []
			}
			transform.transforms.push(['^$', ''])
		},
		addTransformFunction: function(transform) {
			if (!transform.transforms) {
				transform.$add('transforms', [])
				transform.transforms = []
			}
			transform.transforms.push(function(str) {})
		},
		testTransform: function(ev, transforms) {
			var parent = $(ev.target).closest('.node-wrapper')
			var val = parent.find('.test input').val()
			parent.find('.transform-test').text(val ? utils.applyTransformArray(val, transforms) : '')
		},
		menuAddElement: function(node, sentence) {
			var selector = '.menu-add-element'
			var nodeCache = this.$root.nodeCache
			var grammar = this.$root.grammar

			$.contextMenu({
				selector: selector,
				trigger: 'none',
				determinePosition: function($menu) {
					$menu
						.css('display', 'block')
						.position({ my: 'left top', at: 'right bottom-100%', of: this })
						.css('display', 'none')
				},
				events: {
					hide: function() {
						// destroy all context menus
						setTimeout(function(){ $.contextMenu('destroy') }, 0)
					},
				},
				callback: function(key, options) {
					if (key.indexOf('node') !== -1) {
						var keyNode = nodeCache[key.split(':')[1]].node
						if (keyNode.type === 'wordlist' || keyNode.type === 'sentence') {
							sentence.push({ ref: keyNode.id })
						}
					}
					else {
						switch (key) {
						case 'staticString':
							sentence.push({ str: '', editStr: true })
							break
						}
					}
				},
				items: (function() {
					// build menu tree
					var menu = {
						staticString: { name: 'Static string' },
					}

					addContextSubmenu({
						id: 'reference',
						label: 'Reference',
						children: grammar.children,
					}, menu)

					return menu
				})(),
			})
			$(node.$el).find(selector).contextMenu()
		},
		menuUpdateSentenceStr: function(node, element, sentence) {
			var selector = '.menu-update-sentence-str'
			var nodeCache = this.$root.nodeCache
			var grammar = this.$root.grammar

			$.contextMenu({
				selector: selector,
				trigger: 'none',
				determinePosition: function($menu) {
					$menu
						.css('display', 'block')
						.position({ my: 'left top', at: 'right bottom-100%', of: this })
						.css('display', 'none')
				},
				events: {
					hide: function() {
						// destroy all context menus
						setTimeout(function(){ $.contextMenu('destroy') }, 0)
					},
				},
				callback: function(key, options) {
					if (key.indexOf('node') !== -1) {
						var keyNode = nodeCache[key.split(':')[1]].node
						if (keyNode.type === 'wordlist' || keyNode.type === 'sentence') {
							// clear any element modifiers
							element.$delete('transform')
							element.$delete('str')
							element.$delete('ref')
							element.$delete('variable')

							element.$add('ref', keyNode.id)
						}
					}
					else {
						switch (key) {
						case 'edit':
							element.editStr = true
							break
						case 'remove':
							sentence.$remove(element)
							break
						}
					}
				},
				items: (function() {
					// build menu tree
					var menu = {
						edit: { name: 'Edit string' },
						properties: {
							name: 'Properties',
							items: {
								appendWhitespace: {
									name: 'Append whitespace',
									type: 'checkbox',
									selected: (typeof node.element.whitespace === 'undefined' ? true : node.element.whitespace),
									events: {
										click: function(ev) {
											if (!node.element.whitespace) {
												node.element.$add('whitespace')
											}
											node.element.whitespace = ev.target.checked
										},
									},
								},
							},
						},
						div1: '---',
					}

					addContextSubmenu({
						id: 'convertToReference',
						label: 'Convert to reference',
						children: grammar.children,
					}, menu)

					menu.div2 = '---'
					menu.remove = { name: 'Remove', className: 'remove' }

					return menu
				})(),
			})
			$(node.$el).find(selector).contextMenu()
		},
		menuUpdateSentenceRef: function(node, element, sentence) {
			var selector = '.menu-update-sentence-ref'
			var nodeCache = this.$root.nodeCache
			var grammar = this.$root.grammar
			var transforms = this.$root.transforms

			$.contextMenu({
				selector: selector,
				trigger: 'none',
				determinePosition: function($menu) {
					$menu
						.css('display', 'block')
						.position({ my: 'left top', at: 'right bottom-100%', of: this })
						.css('display', 'none')
				},
				events: {
					hide: function() {
						// destroy all context menus
						setTimeout(function(){ $.contextMenu('destroy') }, 0)
					},
				},
				callback: function(key, options) {
					if (key.indexOf('node') !== -1) {
						var keyNode = nodeCache[key.split(':')[1]].node
						if (keyNode.type === 'wordlist' || keyNode.type === 'sentence') {
							// clear any element modifiers
							element.$delete('transform')
							element.$delete('str')
							element.$delete('ref')
							element.$delete('variable')

							element.$add('ref', keyNode.id)
						}
						else {
							if (!element.transform) {
								element.$add('transform', [])
								element.transform = []
							}
							if (element.transform.indexOf(keyNode.id) === -1) {
								// make sure the transform isn't already applied to this element
								element.transform.push(keyNode.id)
							}
						}
					}
					else {
						switch (key) {
						case 'clearTransforms':
							element.$delete('transform')
							break
						case 'remove':
							sentence.$remove(element)
							break
						}
					}
				},
				items: (function() {
					// build menu tree
					var menu = {}

					addContextSubmenu({
						id: 'transform',
						label: 'Transform',
						children: transforms.children,
					}, menu)

					menu.properties = {
						name: 'Properties',
						items: {
							appendWhitespace: {
								name: 'Append whitespace',
								type: 'checkbox',
								selected: (typeof node.element.whitespace === 'undefined' ? true : node.element.whitespace),
								events: {
									click: function(ev) {
										if (!node.element.whitespace) {
											node.element.$add('whitespace')
										}
										node.element.whitespace = ev.target.checked
									},
								},
							},
							assignVariable: {
								name: 'Variable reference:',
								type: 'text',
								value: node.element.variable,
								events: {
									keyup: function(ev) {
										if (!node.element.variable) {
											node.element.$add('variable', ev.target.value)
										}
										node.element.variable = ev.target.value
									},
								},
							},
						}
					}

					menu['node:transform'].items.div1 = '---'
					menu['node:transform'].items.clearTransforms = { name: 'Clear transforms', className: 'remove' }

					menu.div1 = '---'

					addContextSubmenu({
						id: 'changeReference',
						label: 'Change reference',
						children: grammar.children,
					}, menu)

					menu.convertToString = { name: 'Convert to string' },
					menu.div3 = '---'
					menu.remove = { name: 'Remove', className: 'remove' }

					return menu
				})(),
			})
			$(node.$el).find(selector).contextMenu()
		},
	},
})

// popup windows
$('.popup button.dismiss').click(function() {
	$.magnificPopup.close()
})
function popupAlert(text, iconClass, buttonText) {
	$('#popup-alert .text').html(text)
	$('#popup-alert .btn').text((buttonText || 'OK'))
	$('#popup-alert .icon').attr('class', 'icon ' + (iconClass || 'info'))

	$.magnificPopup.open({
		mainClass: 'mfp-transition-zoom-in',
		removalDelay: 300,
		preloader: false,
		closeBtnInside: false,
		callbacks: {
			open: function() {
				setTimeout(function() {
					$('#popup-alert button').focus()
				}, 100)
			}
		},
		items: {
			type: 'inline',
			src: '#popup-alert',
		},
	})
}

$('#import-grammar').magnificPopup({
	type: 'inline',
	preloader: false,
	closeBtnInside: false,
	removalDelay: 300,
	mainClass: 'mfp-transition-zoom-in',
	callbacks: {
		open: function() {
			setTimeout(function() {
				$('#popup-import-grammar input[name=gist-uri]').focus()
			}, 100)
		},
		afterClose: function() {
			var gistUri = $('#popup-import-grammar input[name=gist-uri]')
			var gistUriVal = gistUri.val()
			gistUri.val('')

			if (gistUriVal) {
				importGist(gistUriVal)
				return
			}

			var jsonText = $('#popup-import-grammar textarea')
			var jsonTextVal = jsonText.val()
			jsonText.val('')

			if (jsonTextVal) {
				importJson(jsonTextVal)
			}
		},
	},
})
$('#popup-import-grammar input[name=gist-uri]').keydown(function(ev) {
	if (ev.keyCode === 13) {
        $.magnificPopup.close()
	}
})

// import functions
function importJson(jsonText) {
	if (!jsonText) {
		console.warn('Missing JSON text')
		return
	}
	var jsonObj
	try {
		jsonObj = JSON.parse(jsonText)
	}
	catch (e) {
		popupAlert('An error occured while parsing the JSON string: ' + e, 'error')
		return
	}
	if (!jsonObj) {
		console.warn('Empty JSON object')
		return
	}
	vm.grammar = jsonObj
    console.debug('JSON text imported successfully!')
}

function importGist(uri) {
	if (!uri) {
		popupAlert('Could not import grammar: missing gist URI or ID.', 'error')
		return
	}

	var id = uri.split('/').slice(-1)[0]
	var queryUri = 'https://api.github.com/gists/' + id

	$.getJSON(queryUri)
		.done(function(data) {
			var grammar = ''
			for (var file in data.files) {
				if (data.files.hasOwnProperty(file)) {
					// only read first item
					// TODO handle multiple items by prompting the user?
					try {
						grammar = JSON.parse(data.files[file].content)
						break
					}
					catch (e) {
						popupAlert('Could not import JSON: ' + e, 'error')
						return
					}
				}
			}

			if (!grammar) {
				popupAlert('Could not read any files from the gist!', 'error')
				return
			}

			popupAlert('The grammar <strong>' + grammar.name + '</strong> by <strong>' + grammar.author + '</strong> was successfully imported.')
			vm.grammar = grammar
		})
		.fail(function() {
			popupAlert('Could not import grammar: invalid gist URI or ID.', 'error')
		})
}

// handle gist ID/URI in query string
if (window.location.hash) {
	var split = window.location.hash.substring(1).split(':')
	switch (split[0]) {
	case 'gist':
		importGist(split[1])
	}
}
