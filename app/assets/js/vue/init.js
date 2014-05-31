var S = require('../lib/string')
var saveAs = require('../lib/filesaver')
var storage = require('../storage')
var utils = require('../utils')
var vueUtils = require('./utils')
var Vue = require('../lib/vue')

module.exports = function() {
	require('./generator')()

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
			utils.sortByProperty(children, 'label')
			children.forEach(function(el) {
				addContextSubmenu(el, parent[id].items)
			})
		}
	}

	function grammarWatcher() {
		console.debug('Refreshing generator nodes')

		// reset the exported preview generator every time the grammar changes
		this.exportedGenerator = null
		$('#generator-preview-contents').text('')
		$('.generator-preview-buttons li').removeClass('active')

		vueUtils.createNodeCache(this)
		vueUtils.updateSlugs(this)

		// update open node object
		for (var key in this.nodeCache) {
			if (this.nodeCache.hasOwnProperty(key) && typeof this.openNodes[key] === 'undefined') {
				this.openNodes.$add(key, false)
			}
		}

		// backup grammar in local storage
		storage.save(this)
	}
	var transformsWatcher = grammarWatcher

	function exposedWatcher() {
		console.debug('Refreshing exposed nodes')

		vueUtils.createNodeCache(this)
		vueUtils.updateSlugs(this)

		// backup grammar in local storage
		storage.save(this)
	}

	return new Vue({
		el: 'body',
		data: {
			generator: storage.load(),
			nodeCache: {},
			openNodes: {},
			exportType: 'module',
			tab: 'grammar',
		},
		lazy: true,
		created: function() {
			vueUtils.createNodeCache(this)
			vueUtils.updateSlugs(this)

			if (!this.generator.grammar) {
				this.generator.grammar = {}
			}
			if (!this.generator.transforms) {
				this.generator.transforms = {}
			}
			if (!this.generator.exposed) {
				this.generator.exposed = []
			}

			// we don't need to watch the exposed keypath for changes
			this.$watch('generator.grammar', grammarWatcher.bind(this))
			this.$watch('generator.transforms', transformsWatcher.bind(this))
			this.$watch('generator.exposed', exposedWatcher.bind(this))
		},
		methods: {
			swapItems: utils.swapItems,
			sortByProperty: utils.sortByProperty,
			removeGroup: function(model, parent) {
				parent.children.$remove(model)
				storage.save(this.$root) // force save
			},
			previewGenerator: function(ev, label) {
				var $root = this.$root
				var obj = this
				require.ensure(['../export'], function(require) {
					var exportGenerator = require('../export')
					var slug = S(label).slugify().toString()
					var container = $('#generator-preview-contents')

					function updatePreview() {
						$('.generator-preview-buttons li').removeClass('active')
						$(ev.target).addClass('active')
						container.text(obj.exportedGenerator.generator[slug]())
					}

					if (!obj.exportedGenerator) {
						console.debug('Grammar changed, recompiling')

						exportGenerator.export($root, 'module', false)
							.done(function(data) {
								var context = {}

								new Function(data).call(context)

								obj.exportedGenerator = context.Baba
								updatePreview()
							})
					}
					else {
						updatePreview()
					}
				})
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
			getRawGenerator: function() {
				var traverse = require('../lib/traverse')
				var allowedKeys = [
					'exposed', 'grammar', 'transforms', // root nodes
					'author', 'comment', // grammar properties
					// common properties
					'id', 'name', 'type', 'children', 'elements', 'label', 'tag', 'transforms', 'ref', 'str', 'whitespace', 'probability',
				]
				// sanitize exported data
				return traverse(this.$root.generator).map(function(node) {
					if (typeof node === 'function') {
						// convert functions to strings
						this.update(node.toString())
					}
					if (this.isLeaf && !Array.isArray(this.parent.node) && allowedKeys.indexOf(this.key) === -1) {
						// remove disallowed keys
						this.remove()
					}
					if (node === [] || node === {} || node === undefined || node === null) {
						// remove empty nodes
						this.remove()
					}
				})
			},
			exportRawGenerator: function() {
				var generator = this.getRawGenerator()
				var data = JSON.stringify(generator, undefined, '\t')
				var slug = this.$root.grammarNameSlug

				$.magnificPopup.open({
					mainClass: 'mfp-transition-zoom-in',
					removalDelay: 300,
					preloader: false,
					closeBtnInside: false,
					callbacks: {
						open: function() {
							$('#popup-export-json textarea').text(data)
							$('#popup-export-json button.download').click(function() {
								var blob = new Blob([data], { type: 'application/json' })
								saveAs(blob, slug + '.grammar.json')
							})
							setTimeout(function() {
								$('#popup-export-json textarea').select()
							}, 100)
						}
					},
					items: {
						type: 'inline',
						src: '#popup-export-json',
					},
				})
			},
			exportGeneratorJS: function() {
				var $root = this.$root
				var slug = $root.grammarNameSlug
				require.ensure(['../export'], function(require) {
					var exportGenerator = require('../export')
					exportGenerator.export($root, $root.exportType, true)
						.done(function(data) {
							$('#popup-export-generator label').click(function() {
								Vue.nextTick(function() {
									exportGenerator.export($root, $root.exportType, true)
										.done(function(data) {
											$('#popup-export-generator textarea').text(data).select()
										})
								})
							})

							$.magnificPopup.open({
								mainClass: 'mfp-transition-zoom-in',
								removalDelay: 300,
								preloader: false,
								closeBtnInside: false,
								callbacks: {
									open: function() {
										$('#popup-export-generator textarea').text(data)
										$('#popup-export-generator button.download').click(function() {
											var blob = new Blob([$('#popup-export-generator textarea').val()], { type: 'application/javascript' })
											saveAs(blob, slug + '.js')
										})
										setTimeout(function() {
											$('#popup-export-generator textarea').select()
										}, 100)
									}
								},
								items: {
									type: 'inline',
									src: '#popup-export-generator',
								},
							})
						})
				})
			},
			addChild: function(model, type) {
				if (!model.children) {
					model.$add('children', [])
					model.children = []
				}
				var obj = {
					id: utils.generateId(),
				}
				switch (type) {
					default:
				case 'group':
					obj.children = []
					break
				case 'wordlist':
					obj.type = type
					obj.elements = []
					break
				case 'sentence':
					obj.type = type
					obj.elements = [{sentence:[]}]
					break
				case 'transforms':
					obj.transforms = []
					break
				}

				model.children.push(obj)

				Vue.nextTick(function() {
					// find first empty label node and expand it
					$('.header .label').filter(function() { return $(this).text() === '' }).focus()
				})

				return obj
			},
			menuAddElement: function(node, sentence) {
				var selector = '.menu-add-element'
				var nodeCache = this.$root.nodeCache
				var grammar = this.$root.generator.grammar || {}

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
							Vue.nextTick(function(){ $.contextMenu('destroy') })
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
								sentence.push({ str: '' })
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
				var grammar = this.$root.generator.grammar || {}

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
							Vue.nextTick(function(){ $.contextMenu('destroy') })
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
							case 'remove':
								sentence.$remove(element)
								break
							}
						}
					},
					items: (function() {
						// build menu tree
						var menu = {
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
										probabilityOfAppearing: {
											name: 'Probability of appearing (0-100):',
											type: 'text',
											value: node.element.probability,
											events: {
												keyup: function(ev) {
													if (!node.element.variable) {
														node.element.$add('probability', 100)
													}
													node.element.probability = parseInt(ev.target.value) || undefined
												},
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
				var grammar = this.$root.generator.grammar || {}
				var transforms = this.$root.generator.transforms || {}

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
							Vue.nextTick(function(){ $.contextMenu('destroy') })
						},
					},
					callback: function(key) {
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
											node.element.variable = ev.target.value || undefined
										},
									},
								},
								probabilityOfAppearing: {
									name: 'Probability of appearing (0-100):',
									type: 'text',
									value: node.element.probability,
									events: {
										keyup: function(ev) {
											if (!node.element.variable) {
												node.element.$add('probability', 100)
											}
											node.element.probability = parseInt(ev.target.value) || undefined
										},
									},
								},
							}
						}

						if (menu['node:transform']) {
							menu['node:transform'].items.div1 = '---'
							menu['node:transform'].items.clearTransforms = { name: 'Clear transforms', className: 'remove' }
						}

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
}
