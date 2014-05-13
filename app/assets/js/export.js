// functions to include in the exported JS code
var moduleName = 'Baba'
var exportFunctions = {
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
					ret.push(parseElements(el()))
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
}

// export grammar
function exportGrammar(vm) {
	var ret = []

	for (var fn in exportFunctions) {
		if (exportFunctions.hasOwnProperty(fn)) {
			ret.push('var ' + fn + ' = ' + exportFunctions[fn])
		}
	}
	ret.push('var exported = {}')

	// traverse grammar tree
	function getGrammarVariables(node, parentIndex) {
		var ret = []
		parentIndex = parentIndex || []
		if (node.children) {
			var index = 0
			node.children.forEach(function(el) {
				ret = ret.concat(getGrammarVariables(el, parentIndex.concat([index++])))
			})
		}
		if (node.elements) {
            var nodeName = 'grammarNode_' + parentIndex.join('_')
			if (node.type === 'wordlist') {
				ret.push([
					'var ',
					nodeName,
					' = ',
					JSON.stringify(node.elements.map(function(el) {
						return el.expr
					})),
				].join(''))
			}
			else if (node.type === 'sentence') {
					// ,
				ret.push([
					'var ',
					nodeName,
					' = parseElements(',
					node.elements.map(function(el) {
						if (el.expr) {
							return JSON.stringify(el.expr)
						}
						if (el.path) {
							// TODO handle prefix/postfix
							// TODO handle whitespace
							// TODO handle transforms
							return 'grammarNode_' + el.path.join('_')
						}
					}),
					')',
				].join(''))

				if (node.export) {
					// export sentence for usage via the global baba object
					ret.push([
						'exported[',
						JSON.stringify(S(node.label).slugify().camelize().toString()),
						'] = ', nodeName,
					].join(''))
				}
			}
		}
		return ret
	}

	ret = ret.concat(getGrammarVariables(vm.$data.grammar))

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

module.exports = {
	exportToBrowser: function (grammar) {
		// create raw JS code to be exported
		var exported = []

		// wrap in UMD, compatible with AMD/CommonJS/browser
		exported.push('(function (root, factory) {')
		exported.push('if (typeof define === "function" && define.amd) { define([], factory) }')
		exported.push('else if (typeof exports === "object") { module.exports = factory() }')
		exported.push('else { root.' + moduleName + ' = factory() }')
		exported.push('}(this, function() {')
		exported.push(exportGrammar(grammar))
		exported.push('return exported')
		exported.push('}))')

		exported = exported.join('\n')

		return compress(exported)
	},
}
