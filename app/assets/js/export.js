var utils = require('./utils')
var S = require('./lib/string')
var Mustache = require('./lib/mustache')

var moduleName = 'Baba'
var exportFunctions = {
	randomItem: utils.randomItem,
	shuffle: utils.shuffle,
	splitString: function(str) {
		return str.split('|')
	},
	parseElements: function() {
		return function(elements) {
			var ret = ''
			var indexCounters = {}
			var el, idx, type

			for (idx in elements) { // jshint ignore:line
				// we're not overriding the prototype in the generator
				// so we don't need a hasOwnProperty check here
				el = elements[idx]
				if (Array.isArray(el)) {
					// shuffle all array arguments initially, this shuffles
					// references so any reference will remain the same
					shuffle(el)

					// for improved randomness we'll avoid duplicate elements in a
					// sentence by shuffling the element array initially and then
					// "slicing" out the elements we need from the array instead of
					// picking a random element on every iteration
					indexCounters[elements.indexOf(el)] = 0
				}
			}

			for (idx in elements) { // jshint ignore:line
				// we're not overriding the prototype in the generator
				// so we don't need a hasOwnProperty check here
				el = elements[idx]

				// chained ifs compiles down to less code than a switch
				type = typeof el
				if (type === 'string') {
					ret += el
				}
				else if (type === 'function') {
					ret += parseElements(el())()
				}
				else if (Array.isArray(el)) {
					// add an element from the shuffled element array based on the
					// index counter, or fall back to randomItem if we don't have
					// enough elements for every element to be unique
					ret += parseElements(el[indexCounters[elements.indexOf(el)]++] || randomItem(el))()
				}
			}

			return ret.trim()
		}.bind(this, [].slice.call(arguments))
	},
	applyProbability: function(probability, str) {
		return function() {
			return (Math.random() * 100) < probability ? str : null
		}
	},
	applyVariable: function(str, variable) {
		return function() {
			if (!variables[variable]) {
				// assign parsed element reference (to ensure that it's a string) to
				// the variable if the variable isn't set by the user, this ensures
				// that the value will remain the same if the variable is used later
				variables[variable] = parseElements(str)()
			}
			return variables[variable]
		}
	},
	applyTransforms: function() {
		return function(elements, transforms) {
			// we need to transform a string, so handle any arrays or functions first
			var parsed = parseElements(elements)()
			var search

			transforms.forEach(function(transform) {
				transform.some(function(rule) {
					if (typeof rule === 'function') {
						// function transform
						parsed = rule(parsed)
						return
					}
					// regexp transform
					search = new RegExp(rule[0], 'ig')
					if (parsed.match(search)) {
						parsed = parsed.replace(search, rule[1])
						return true
					}
				})
			})

			return parsed
		}.bind(this, arguments[0], [].slice.call(arguments, 1))
	},
}

function exportGenerator(vm) {
	var ret = []
	var exportedNodes = []
	var grammarExports = []
	var variables = {}
	var nodeCache = new utils.NodeCache()

	nodeCache.refresh(vm.$root.generator)

	exportedNodes.push(['SPACE', '" "'])

	// add exported functions
	for (var fn in exportFunctions) {
		if (exportFunctions.hasOwnProperty(fn)) {
			exportedNodes.push([fn, exportFunctions[fn]])
		}
	}

	// add node cache variables (unused variables will be removed by uglifyjs)
	for (var node in nodeCache.cache) {
		if (nodeCache.cache.hasOwnProperty(node)) {
			node = nodeCache.get(node).node
			var nodeName = 'node_' + node.id
			// add exported functions as default dependencies
			var dependencies = Object.keys(exportFunctions).concat(['SPACE'])

			if (node.type === 'wordlist') {
				var data = node.elements
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
				exportedNodes.unshift([nodeName, data])
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

							if (el.ref) {
								var node = nodeCache.get(el.ref).node
								var grammarNode = 'node_' + node.id
								var grammarNodeTransforms = []

								if (dependencies.indexOf(grammarNode) === -1) {
									// add unique node dependencies
									dependencies.push(grammarNode)
								}

								if (grammarNode === nodeName) {
									// recursive reference, the element has to be returned from a function as it doesn't exist at parse time
									// the element has a 50% chance to return itself, usually it will repeat itself 0-2 times
									// TODO add customizable probability
									grammarNode = 'function() { return Math.random() < 0.5 ? parseElements(' + grammarNode + ') : "" }'
								}

								;(el.transform || []).forEach(function(tf) {
									tf = nodeCache.get(tf).node
									var tfKey = 'node_' + tf.id
									grammarNodeTransforms.push(tfKey)

									if (dependencies.indexOf(tfKey) === -1) {
										dependencies.push(tfKey)
									}
								})

								if (el.variable) {
									variables[el.variable] = null
									grammarNode = 'applyVariable(' + grammarNode + ', '
									grammarNode += JSON.stringify(el.variable)
									grammarNode += ')'
								}

								if (grammarNodeTransforms.length) {
									grammarNode = 'applyTransforms(' + grammarNode + ', '
									grammarNode += grammarNodeTransforms.join(', ')
									grammarNode += ')'
								}

								ret = grammarNode
							}
							else {
								ret = JSON.stringify(el.str || '')
							}

							if (el.probability && el.probability < 100) {
								ret = 'applyProbability(' + parseInt(el.probability) + ', ' + ret + ')'
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
				exportedNodes.push([nodeName, sentenceStr, dependencies])

				if (vm.generator.exposed.indexOf(node.id) > -1) {
					grammarExports.push([node.label, nodeName])
				}
			}
			else if (node.transforms) {
				// add transforms regexps
				var nodeTransforms = node.transforms.map(function(tf) {
					if (typeof tf === 'string') {
						// raw function transform string (from imported/stored generator)
						return tf
					}
					if (typeof tf === 'function') {
						// stringify function
						return tf.toString()
					}
					return JSON.stringify(tf)
				})

				exportedNodes.push([nodeName, '[' + nodeTransforms.toString() + ']'])
			}
		}
	}

	// resolve exported node dependencies
	var depGraph = []
	var grammarObj = {}
	exportedNodes.forEach(function(el) {
		grammarObj[el[0]] = el[1]

		if (!el[2]) {
			return
		}
		el[2].forEach(function(dep) {
			depGraph.push([el[0], dep])
		})
	})

	// write variables object
	ret.push('var variables = ' + JSON.stringify(variables))

	// write exported nodes
	utils.tsort(depGraph).reverse().forEach(function(key) {
		ret.push('var ' + key + ' = ' + grammarObj[key])
	})

	ret.push('return {')

	// add generator object
	ret.push('generator: {')
	grammarExports.forEach(function(value) {
		var key = JSON.stringify(S(value[0]).slugify().toString())
		ret.push(key + ': ' + value[1] + ',')
	})
	ret.push('},')

	// add variable functions
	ret.push('variable: {')
	ret.push('obj: variables,')
	ret.push('set: function(variable, value) { variables[variable] = value },')
	ret.push('},')

	ret.push('}')

	return ret.join('\n')
}

module.exports = {
	export: function (vm, type, uglify, callback) {
		var deferred = $.Deferred()
		var template
		var templateVars = {
			generator: exportGenerator(vm),
			generatorName: (vm.generator.grammar.name || 'Unnamed text generator'),
			generatorAuthor: (vm.generator.grammar.author || 'an unknown author'),
			moduleName: moduleName,
		}

		switch (type) {
		default:
		case 'module':
			template = Mustache.render(require('raw!./templates/export.module.js'), templateVars)
			break
		case 'executable':
			template = Mustache.render(require('raw!./templates/export.executable.js'), templateVars)
			break
		}

		if (uglify) {
			require.ensure(['./lib/uglify-js'], function(require) {
				var UglifyJS = require('./lib/uglify-js')
				var ast = UglifyJS.parse(template)
				var compressor = UglifyJS.Compressor({
					unsafe: true,
					pure_getters: true,
				})
				ast.figure_out_scope()
				var compressed_ast = ast.transform(compressor)
				compressed_ast.figure_out_scope()
				compressed_ast.compute_char_frequency()
				compressed_ast.mangle_names()

				deferred.resolve(compressed_ast.print_to_string({
					comments: /^\**!|@preserve|@license/,
				}))
			})
		}
		else {
			deferred.resolve(template)
		}

		return deferred.promise()
	},
}
