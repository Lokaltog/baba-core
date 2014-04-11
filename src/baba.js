/*!
 * baba.js - JavaScript garbage text generator inspired by the Dada Engine
 *
 * Author: Kim Silkebækken
 *
 * https://github.com/Lokaltog/baba
 */

(function (global, module, define) {
	// Private variables
	var _babaGrammars = {}

	// Utility functions
	function escapeRegExp (string) {
		return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
	}

	function escapeTags(tags, consumeWs) {
		if (!Array.isArray(tags) || tags.length !== 2) {
			throw new Error('Invalid tags: ' + tags)
		}

		return [
			escapeRegExp(tags[0]) + (consumeWs ? '\\s*' : ''),
			(consumeWs ? '\\s*' : '') + escapeRegExp(tags[1]),
		]
	}

	function mergeRecursive(obj1, obj2) {
		for (var p in obj2) {
			if (obj2.hasOwnProperty(p)) {
				try {
					// Property in destination object set update its value.
					if (obj2[p].constructor === Object) {
						obj1[p] = mergeRecursive(obj1[p], obj2[p])
					}
					else {
						obj1[p] = obj2[p]
					}
				}
				catch (e) {
					// Property in destination object not set create it and set its value.
					obj1[p] = obj2[p]
				}
			}
		}
		return obj1
	}

	function randomItem(items) {
		return items[Math.floor(Math.random() * items.length)]
	}

	function objPropertyPath(obj, path, silent) {
		var arr = path.split('.')
		while (arr.length && (obj = obj[arr.shift()])) {}
		if (typeof obj === 'undefined' && !silent) {
			throw 'Undefined property path: ' + path
		}
		return obj
	}

	var Baba = global.Baba = {
		Parser: function (grammar, variables) {
			if (!grammar) {
				throw 'No grammar provided'
			}
			else if (!_babaGrammars.hasOwnProperty(grammar)) {
				throw 'Grammar ' + grammar + ' not loaded'
			}
			var _grammar = _babaGrammars[grammar]
			var _variables = variables || {}

			// Public methods
			this.render = function (grammarPath) {
				return parseGrammar(objPropertyPath(_grammar.grammar, grammarPath) || '')
			}

			this.setVariable = function (key, value) {
				_variables[key] = value
			}

			// Private methods
			function parseGrammar(elements) {
				if (typeof elements === 'function') {
					return parseGrammar(elements())
				}
				if (typeof elements === 'object') {
					return parseGrammar(randomItem(elements))
				}
				if (typeof elements === 'string') {
					return parseString(elements)
				}
			}

			function parseString(str) {
				var refTagRE = escapeTags(_grammar.tags.ref, true)
				var altTagRE = escapeTags(_grammar.tags.alt)

				str = str.replace(new RegExp(refTagRE[0] + '(.+?)' + refTagRE[1], 'g'), replaceRefTags)
				str = str.replace(new RegExp(altTagRE[0] + '(.+?)' + altTagRE[1], 'g'), replaceAltTags)

				return str
			}

			function replaceAltTags(m, $1) {
				return randomItem($1.split('|'))
			}

			function replaceRefTags(m, $1) {
				// Split variable and modifiers
				var split = $1.match(/(\\.|[^\|])+/g)
				var ref = split[0]
				var transforms = split.slice(1, split.length)
				var grammarParent = ''
				var refValue = ''

				// Check if we need to assign variables later
				var refToVariables = []
				var refSplit = ref.split('->')
				if (refSplit.length > 1) {
					ref = refSplit[0]
					refToVariables = refSplit.slice(1, refSplit.length)
				}

				if (ref[0] === '$') {
					var varNameSplit = ref.split(/\s+/g)
					var key = varNameSplit[0].slice(1, varNameSplit[0].length)
					var fallback = typeof varNameSplit[1] !== 'undefined' ? varNameSplit[1] : null

					if (_variables.hasOwnProperty(key)) {
						refValue = _variables[key]
					}
					else if (fallback) {
						refValue = objPropertyPath(_grammar.grammar, fallback)
						grammarParent = fallback.split('.')[0]
					}
					else {
						throw 'Undefined variable: $' + key
					}
				}
				else {
					refValue = objPropertyPath(_grammar.grammar, ref)
					grammarParent = ref.split('.')[0]
				}

				refValue = parseGrammar(refValue)
				if (typeof refValue === 'undefined') {
					throw 'Invalid reference: ' + $1
				}

				// Set any variables to the raw parsed value here
				refToVariables.forEach(function (key) {
					_variables[key] = refValue
				})

				// Transform the value
				transforms.forEach(function (transform) {
					refValue = applyTransform(refValue, transform, grammarParent)
				})

				// Re-parse the transform data in case the transform returns more stuff to be interpolated
				refValue = parseGrammar(refValue)

				return refValue
			}

			function applyTransform(str, transform, grammarParent) {
				// Check if we need to assign variables later
				var transformToVariables = []
				var transformSplit = transform.split('->')
				if (transformSplit.length > 1) {
					transform = transformSplit[0]
					transformToVariables = transformSplit.slice(1, transformSplit.length)
				}

				// Transforms accept a JSON array as argument, this array will be passed as
				// arguments to the transform function
				var transformData = transform.match(/^([\w\.\-]+)\s*(.*)$/)
				var transformPath = ''
				var callArgs = [str]
				var transformedStr = ''

				transform = transformData[1]
				if (transformData[2]) {
					try {
						callArgs = callArgs.concat(JSON.parse(transformData[2]))
					}
					catch (e) {
						throw 'JSON parse error: ' + e
					}
				}

				// Find transform property path, could probably be improved a bit
				if (objPropertyPath(_grammar.transforms, transform, true)) {
					transformPath = transform
				}
				else if (objPropertyPath(_grammar.transforms, ['__common__', transform].join('.'), true)) {
					transformPath = ['__common__', transform].join('.')
				}
				else if (objPropertyPath(_grammar.transforms, [grammarParent, transform].join('.'), true)) {
					transformPath = [grammarParent, transform].join('.')
				}
				else {
					throw 'Invalid transformer: ' + transform
				}

				transformedStr = objPropertyPath(_grammar.transforms, transformPath).apply(this, callArgs)

				// Set any variables to the raw parsed value here
				transformToVariables.forEach(function (key) {
					_variables[key] = transformedStr
				})

				return transformedStr
			}
		},
		Grammar: function (name, refTags, altTags) {
			var _grammar = {
				name: name,
				transforms: {},
				grammar: {},
				tags: {
					ref: refTags || ['{{', '}}'],
					alt: altTags || ['[[', ']]'],
				},
			}

			_babaGrammars[name] = _grammar

			this.addTransforms = function (transforms) {
				_grammar.transforms = mergeRecursive(_grammar.transforms, transforms)
			}

			this.addGrammar = function (grammar) {
				_grammar.grammar = mergeRecursive(_grammar.grammar, grammar)
			}

			this.require = function (name) {
				if (!_babaGrammars.hasOwnProperty(name)) {
					throw 'Invalid grammar: ' + name
				}
				var requiredGrammar = _babaGrammars[name]
				this.addTransforms(requiredGrammar.transforms)
				this.addGrammar(requiredGrammar.grammar)
			}
		},
	}

	// Export as either CommonJS or AMD module
	if (module && module.exports) {
		module.exports = Baba
	}
	else if (define && define.amd) {
		define(function () {
			return Baba
		})
	}
})(this, typeof module === 'object' && module, typeof define === 'function' && define)
