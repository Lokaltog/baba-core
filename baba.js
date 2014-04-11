/*!
 * baba.js - JavaScript garbage text generator inspired by the Dada Engine
 *
 * Author: Kim Silkebækken
 *
 * https://github.com/Lokaltog/baba
 */

(function (root, factory) {
	if (typeof exports === 'object' && exports) {
		factory(exports) // CommonJS
	}
	else {
		var baba = {}
		factory(baba)
		if (typeof define === 'function' && define.amd) {
			define(baba) // AMD
		}
		else {
			root.Baba = baba // <script>
		}
	}
}(this, function (baba) {
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
			try {
				// Property in destination object set update its value.
				if (obj2[p].constructor == Object) {
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
		return obj1
	}

	function randItem(items) {
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

	function parseGrammar(elements) {
		if (typeof elements === 'function') {
			return parseGrammar(elements())
		}
		if (typeof elements === 'object') {
			return parseGrammar(randItem(elements))
		}
		if (typeof elements === 'string') {
			return parseString(elements)
		}
	}

	function parseString(str) {
		var refTagRE = escapeTags(baba.refTags, true)
		var altTagRE = escapeTags(baba.altTags)

		str = str.replace(new RegExp(refTagRE[0] + '(.+?)' + refTagRE[1], 'g'), replaceRefTags)
		str = str.replace(new RegExp(altTagRE[0] + '(.+?)' + altTagRE[1], 'g'), replaceAltTags)

		return str
	}

	function replaceAltTags(m, $1) {
		return randItem($1.split('|'))
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
			ref = ref.slice(1, ref.length)
			refValue = getTagVariable(ref)
		}
		else {
			refValue = objPropertyPath(baba.grammar, ref)
			grammarParent = ref.split('.')[0]
		}

		refValue = parseGrammar(refValue)
		if (typeof refValue === 'undefined') {
			throw 'Invalid reference: ' + $1
		}

		// Set any variables to the raw parsed value here
		refToVariables.forEach(function (key) {
			baba.tagVariables[key] = refValue
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
		if (objPropertyPath(baba.transforms, transform, true)) {
			transformPath = transform
		}
		else if (objPropertyPath(baba.transforms, ['__common__', transform].join('.'), true)) {
			transformPath = ['__common__', transform].join('.')
		}
		else if (objPropertyPath(baba.transforms, [grammarParent, transform].join('.'), true)) {
			transformPath = [grammarParent, transform].join('.')
		}
		else {
			throw 'Invalid transformer: ' + transform
		}

		transformedStr = objPropertyPath(baba.transforms, transformPath).apply(baba, callArgs)

		// Set any variables to the raw parsed value here
		transformToVariables.forEach(function (key) {
			baba.tagVariables[key] = transformedStr
		})

		return transformedStr
	}

	function getTagVariable(key) {
		if (baba.tagVariables.hasOwnProperty(key)) {
			return baba.tagVariables[key]
		}
		throw 'Undefined variable: $' + key
	}

	baba.name = 'baba.js'
	baba.version = 'develop'
	baba.refTags = ['{{', '}}']
	baba.altTags = ['[[', ']]']
	baba.grammar = {}
	baba.transforms = {}
	baba.tagVariables = {}

	baba.init = function (grammar, transforms, refTags, altTags, tagVariables) {
		if (refTags) {
			baba.refTags = refTags
		}
		if (altTags) {
			baba.altTags = altTags
		}
		baba.grammar = grammar
		baba.tagVariables = tagVariables || {}

		// Load all transforms
		if (!Array.isArray(transforms)) {
			transforms = [transforms]
		}
		transforms.forEach(function (t) {
			baba.transforms = mergeRecursive(baba.transforms, t)
		})
	}

	baba.render = function (template) {
		return parseGrammar(template || '')
	}
}))
