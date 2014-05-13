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
			return ret.join('')
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

function exportGrammar(grammarObject, transforms) {
	var ret = []
	var grammarFunctions = {}
	var grammarVariables = {}
	var grammarExports = {}

	for (var fn in exportFunctions) {
		if (exportFunctions.hasOwnProperty(fn)) {
			grammarFunctions[fn] = exportFunctions[fn]
		}
	}

	// traverse grammar tree
	function initGrammarData(node, parentIndex) {
		parentIndex = parentIndex || []
		if (node.children) {
			var index = 0
			node.children.forEach(function(el) {
				initGrammarData(el, parentIndex.concat([index++]))
			})
		}
		if (node.elements) {
            var nodeName = 'grammarNode_' + parentIndex.join('_')
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
				grammarVariables[nodeName] = data
			}
			else if (node.type === 'sentence') {
				grammarVariables[nodeName] =
					'parseElements(' +
					node.elements.map(function(el) {
						if (el.expr) {
							return JSON.stringify(el.expr)
						}
						if (el.path) {
							// TODO handle whitespace
							var grammarNode = 'grammarNode_' + el.path.join('_')
							var grammarNodeTransforms = []

							;(el.transform || []).forEach(function(tfPath) {
								var tf = utils.objPropertyPath(transforms, tfPath)
								var tfKey = 'transform_' + S(tfPath).replace('.', '_').slugify().camelize().toString()
								grammarNodeTransforms.push(tfKey)
								grammarFunctions[tfKey] = tf.fn
							})

							if (grammarNodeTransforms.length) {
								grammarNode = 'applyTransforms(' + grammarNode + ', '
								grammarNode += grammarNodeTransforms.join(', ')
								grammarNode += ')'
							}

							return grammarNode
						}
					}) + ')'

				if (node.export) {
					grammarExports[JSON.stringify(S(node.label).slugify().camelize().toString())] = nodeName
				}
			}
		}
	}

	initGrammarData(grammarObject)

	var key
	for (key in grammarFunctions) {
		if (grammarFunctions.hasOwnProperty(key)) {
			ret.push('var ' + key + ' = ' + grammarFunctions[key])
		}
	}
	for (key in grammarVariables) {
		if (grammarVariables.hasOwnProperty(key)) {
			ret.push('var ' + key + ' = ' + grammarVariables[key])
		}
	}

	ret.push('return {')
	for (key in grammarExports) {
		if (grammarExports.hasOwnProperty(key)) {
			ret.push(key + ': ' + grammarExports[key] + ',')
		}
	}
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
