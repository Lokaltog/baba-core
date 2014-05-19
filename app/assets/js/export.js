// functions to include in the exported JS code
var utils = require('./utils')
var moduleName = 'Baba'
var exportFunctions = {
	replaceRegexp: utils.replaceRegexp,
	randomItem: function(items) {
		return items[Math.floor(Math.random() * items.length)]
	},
	parseElements: function() {
		var elements = arguments
		return function() {
			var ret = []
			for (var el in elements) {
				if (!elements.hasOwnProperty(el)) {
					continue
				}
				el = elements[el]
				var type = typeof el

				if (type === 'string') {
					ret.push(el)
				}
				else if (type === 'function') {
					ret.push(parseElements(el())())
				}
				else if (type === 'object') {
					if (Array.isArray(el)) {
						ret.push(parseElements(randomItem(el))())
					}
				}
			}
			return ret.join('').trim()
		}
	},
	splitString: function(str, divider) {
		return str.split(divider || '|')
	},
	applyTransforms: function() {
		var elements = arguments[0]
		var transforms = Array.prototype.slice.call(arguments, 1, arguments.length)
		return function() {
			// we need to transform a string, so handle any arrays or functions first
			var parsed = parseElements(elements)()
			transforms.forEach(function(fn) {
				parsed = fn(parsed)
			})
			return parsed
		}
	},
}

function exportGrammar(vm) {
	var ret = []
	var grammarFunctions = []
	var grammarVariables = []
	var grammarExports = []

	grammarVariables.unshift(['SPACE', '" "'])

	// add exported functions
	for (var fn in exportFunctions) {
		if (exportFunctions.hasOwnProperty(fn)) {
			grammarFunctions.push([fn, exportFunctions[fn]])
		}
	}

	// add node cache variables (unused variables will be removed by uglifyjs)
	for (var node in vm.nodeCache) {
		if (vm.nodeCache.hasOwnProperty(node)) {
			node = vm.nodeCache[node].node
			var nodeName = 'node_' + node.id

			if (node.type === 'wordlist') {
				var data = node.elements.map(function(el) {
					return el.expr
				})
				var stringify = data.some(function(el) {
					return el.indexOf('|') !== -1
				})
				if (stringify) {
					// export as JSON object as '|' is present in one or more words
					data = JSON.stringify(data)
				}
				else {
					// join string with '|' to save space
					data = 'splitString(' + JSON.stringify(data.join('|')) + ')'
				}
				// ensure that word lists are defined before the sentences
				grammarVariables.unshift([nodeName, data])
			}
			else if (node.type === 'sentence') {
				var sentenceStr = ''
				var sentences = []

				if (node.elements.length > 1) {
					// randomly select sentence from sentence list
                    sentenceStr += 'parseElements(['
				}

				node.elements.forEach(function(sentence) {
					sentences.push(
						'parseElements(' + sentence.sentence.map(function(el, idx) {
							var ret = ''

							if (el.expr) {
								ret = JSON.stringify(el.expr)
							}

							if (el.ref) {
								var node = vm.nodeCache[el.ref].node
								// TODO handle whitespace
								var grammarNode = 'node_' + node.id
								var grammarNodeTransforms = []

								;(el.transform || []).forEach(function(tf) {
									tf = vm.nodeCache[tf].node
									var tfKey = 'node_' + tf.id
									grammarNodeTransforms.push(tfKey)
								})

								if (grammarNodeTransforms.length) {
									grammarNode = 'applyTransforms(' + grammarNode + ', '
									grammarNode += grammarNodeTransforms.join(', ')
									grammarNode += ')'
								}

								ret = grammarNode
							}

							if (el.whitespace !== false && idx < sentence.sentence.length - 1) {
								ret += ',SPACE'
							}

							return ret
						}) + ')')
				})

				sentenceStr += sentences.join(', ')

				if (node.elements.length > 1) {
					sentenceStr += '])'
				}
				grammarVariables.push([nodeName, sentenceStr])

				if (node.export) {
					grammarExports.push([node.label, nodeName])
				}
			}
			else if (node.re) {
				// add transforms regexps
				grammarVariables.unshift([nodeName, JSON.stringify(node.re)])
			}
			else if (node.fn) {
				// add transforms functions
                grammarFunctions.push([nodeName, node.fn])
			}
		}
	}

	grammarFunctions.forEach(function(value) {
		ret.push('var ' + value[0] + ' = ' + value[1])
	})
	grammarVariables.forEach(function(value) {
		ret.push('var ' + value[0] + ' = ' + value[1])
	})

	ret.push('return {')
	grammarExports.forEach(function(value) {
		// TODO slugify for node, camelcase for browser
		var key = JSON.stringify(S(value[0]).slugify().toString())
		ret.push(key + ': ' + value[1] + ',')
	})
	ret.push('}')

	return ret.join('\n')
}

function compress(code) {
	var ast = UglifyJS.parse(code)
	var compressor = UglifyJS.Compressor({
		unsafe: true,
		pure_getters: true,
	})
	ast.figure_out_scope()
	var compressed_ast = ast.transform(compressor)
	compressed_ast.figure_out_scope()
	compressed_ast.compute_char_frequency()
	compressed_ast.mangle_names()

	return compressed_ast.print_to_string()
}

module.exports = function (grammar, transforms) {
	// create raw JS code to be exported
	var exported = []

	// wrap in UMD, compatible with AMD/CommonJS/browser
	exported.push('(function (root, factory) {')
	exported.push('if (typeof define === "function" && define.amd) { define([], factory) }')
	exported.push('else if (typeof exports === "object") { module.exports = factory() }')
	exported.push('else { root.' + moduleName + ' = factory() }')
	exported.push('}(this, function() {')
	exported.push(exportGrammar(grammar, transforms))
	exported.push('}))')

	exported = exported.join('\n')

	return compress(exported)
}
