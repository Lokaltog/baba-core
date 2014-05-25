module.exports = function() {
	var utils = require('../utils')
	var vueUtils = require('./utils')
	var storage = require('../storage')
	var exportGenerator = require('../export')

	require('./grammar')()
	require('./transforms')()

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

	return new Vue({
		el: 'body',
		data: {
			generator: storage.load(),
			nodeCache: {},
			exported: [],
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

			this.$watch('generator', function(generator) {
				console.debug('Generator watcher triggered')

				// walk the grammar tree and detect any exported nodes
				this.exported = vueUtils.getExportedNodes(generator.grammar)

				// reset the exported preview generator every time the grammar changes
				this.exportedGenerator = null
				$('#generator-preview-contents').text('')
				$('.generator-preview-buttons li').removeClass('active')

				vueUtils.createNodeCache(this)
				vueUtils.updateSlugs(this)

				// make sure any new inputs are autosized
				$('input[data-autosize-input]').autosizeInput()

				// backup grammar in local storage
				storage.save(this)
			})
		},
		methods: {
			swapItems: utils.swapItems,
			sortByProperty: utils.sortByProperty,
			removeGroup: function(model, parent) {
				parent.children.$remove(model)
				storage.save(this.$root) // force save
			},
			previewGenerator: function(ev, label) {
				var slug = S(label).slugify().toString()
				var container = $('#generator-preview-contents')

				if (!this.exportedGenerator) {
					console.debug('Grammar changed, recompiling')

					var exportedGenerator = exportGenerator.export(this.$root, 'module', false)
					var context = {}

					new Function(exportedGenerator).call(context)

					this.exportedGenerator = context.Baba
				}

				$('.generator-preview-buttons li').removeClass('active')
				$(ev.target).addClass('active')
				container.text(this.exportedGenerator.generator[slug]())
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
			getRawGenerator: function(convertFunctions) {
				// sanitize grammar
				// remove disallowed keys
				// remove empty properties
				var allowedKeys = [
					'grammar', 'children', 'elements', 'type', 'label', 'comment',
					'id', 'str', 'ref', 'variable', 'sentence', 'transform', 'transforms',
					'name', 'author', 'export', 'whitespace', 'tag', 'probability',
				]

				function sanitizeNode(node, parent) {
					for (var key in node) {
						if (node.hasOwnProperty(key)) {
							if (node[key] === '' ||
							    node[key] === [] ||
							    node[key] === {} ||
							    typeof node[key] === 'undefined' ||
							    allowedKeys.indexOf(key) === -1) {
								continue
							}
							if (Array.isArray(node[key])) {
								parent[key] = []
								node[key].forEach(function(value, idx) {
									if (typeof value === 'object') {
										if (Array.isArray(value)) {
											parent[key][idx] = []
											value.forEach(function(el) {
												parent[key][idx].push(el)
											})
										}
										else {
											parent[key][idx] = {}
											sanitizeNode(value, parent[key][idx])
										}
									}
									else if (typeof value === 'function' && convertFunctions) {
										parent[key][idx] = value.toString()
									}
									else {
										parent[key][idx] = value
									}
								})
							}
							else {
								parent[key] = node[key]
							}
						}
					}
				}

				function sanitizeGenerator(generator) {
					var ret = {}
					for (var key in generator) {
						if (generator.hasOwnProperty(key)) {
							ret[key] = {}
							sanitizeNode(generator[key], ret[key])
						}
					}
					return ret
				}
				var ret = sanitizeGenerator(this.$root.generator)

				return ret
			},
			exportRawGenerator: function() {
				var grammar = this.getRawGenerator()
				var data = JSON.stringify(grammar, undefined, '\t')
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
			exportGrammarGenerator: function() {
				var $root = this.$root
				var data = exportGenerator.export($root, $root.exportType, true)
				var slug = $root.grammarNameSlug

				$('#popup-export-generator label').click(function() {
					setTimeout(function() {
						var data = exportGenerator.export($root, $root.exportType, true)
						$('#popup-export-generator textarea').text(data).select()
					}, 0)
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
								var blob = new Blob([data], { type: 'application/javascript' })
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
			},
			addChild: function(model, type) {
				if (!model.children) {
					model.$add('children', [])
					model.children = []
				}
				var obj = {
					id: utils.generateId(),
					open: true,
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

				setTimeout(function() {
					// find first empty label node and expand it
					$('.header .label :text:visible').filter(function() { return $(this).val() === '' }).focus()
				}, 0)

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
							setTimeout(function(){ $.contextMenu('destroy') }, 0)
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
