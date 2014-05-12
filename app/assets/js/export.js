// functions to include in the exported JS code
var exportFunctions = {
	randomElements: function() {
		// return random elements from items in a list (arguments)
		'randomElements'
	},
	globalBaba: function(key) {
		// export global baba object (generate based on keypath)
		'globalBaba'
	},
	exportSentence: function(key) {
		// export sentence for usage via the global Baba object
		'exportSentence'
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
					' = randomElements(',
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
						'exportSentence(',
						JSON.stringify(S(node.label).slugify().toString()),
						', ',
						nodeName,
						')',
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

		// wrap with browser-specific stuff
		exported.push('(function (global) {')
		exported.push('global.Baba = globalBaba')
		exported.push(exportGrammar(grammar))
		exported.push('})(this)')

		exported = exported.join('\n')

		return compress(exported)
	},
}
