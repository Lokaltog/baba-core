var GrammarParser = function (grammar, filters) {
	var gp = this

	// private functions
	var randItem = function (items) {
		return items[Math.floor(Math.random() * items.length)]
	}

	var randInt = function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min
	}

	var filter = function (str, filters) {
		var ret = ''
		filters.some(function (f) {
			if (typeof str === 'undefined') {
				ret = '<<ERROR>>'
				return true
			}
			if (str.match(f[0])) {
				ret = str.replace(f[0], f[1])
				return true
			}
		})
		return ret
	}

	var parseString = function (str) {
		// replace option groups: [something|something else]
		str = str.replace(/\[(.*?)\]/gi, function (m, $1) {
			return randItem($1.split('|'))
		})
		// replace variables: $variable#filter#filter2
		str = str.replace(/\$([a-z#]+)/gi, function (m, $1) {
			var split = $1.split('#')
			var strRef = split[0]
			var strFilters = split.slice(1, split.length)

			return gp.ref(strRef, null, null, strFilters)()
		})
		return str
	}

	var parseGrammar = function (elements, root) {
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

	// public properties
	this.grammar = {}

	// public functions
	this.setGrammar = function (grammar) {
		this.grammar = grammar
	}

	this.setFilters = function (filters) {
		for (var attr in filters) {
			gp.filters[attr] = filters[attr]
		}
	}

	this.ref = function (key, min, max, filterList) {
		var refFilters = []
		if (typeof min === 'string' && !filterList) {
			filterList = min
		}

		if (filterList) {
			if (typeof filterList === 'string') {
				filterList = [filterList]
			}
			filterList.forEach(function (filter) {
				refFilters.push(gp.filters[filter])
			})
		}

		return function () {
			var ret = []
			var len = typeof min === 'number' && typeof max === 'number' ? randInt(min, max) : 1
			for (var i = 0; i < len; i++) {
				var item = parseGrammar(gp.grammar[key])
				if (refFilters) {
					refFilters.forEach(function (f) {
						item = filter(item, f)
					})
				}
				ret.push(item)
			}
			return ret.join(' ')
		}
	}

	this.group = function () {
		var items = arguments
		return function () {
			var ret = []
			for (var i = 0; i < items.length; i++) {
				ret.push(parseGrammar(items[i]))
			}
			return ret.join('')
		}
	}

	this.render = function (key) {
		return parseGrammar(gp.grammar[key])
	}
}

// common grammar filters
GrammarParser.prototype.filters = {
	pluralize: [
		[/(.*)ex$/i, '$1ices'],
		[/(.*)y$/i, '$1ies'],
		[/(.*)([sc]h|s)$/i, '$1$2es'],
		[/(.*)/i, '$1s'],
	],
	verbPresentTensify: [
		// general rules
		[/(.*)y$/i, '$1ies'],
		[/(.*)([sc]h|s)$/i, '$1$2es'],
		[/(.*)/i, '$1s'],
	],
	verbPastTensify: [
		// exceptions
		[/^((re)?set)$/i, '$1'],
		[/^(send)$/i, 'sent'],
		[/^(show)$/i, 'shown'],
		[/^(checkout)$/i, 'checked out'],
		// general rules
		[/(.*[aeiouy])([bcdfglmnprstvz])$/i, '$1$2$2ed'],
		[/(.*)e$/i, '$1ed'],
		[/(.*)y$/i, '$1ied'],
		[/(.*)/i, '$1ed'],
	],
	verbPresentParticiplify: [
		[/(.*[aeiouy])([bcdfglmnprstvz])$/i, '$1$2$2ing'],
		[/(.*)e$/i, '$1ing'],
		[/(.*)$/i, '$1ing'],
	],
	prependAn: [
		[/^([aeiou].*)/i, 'an $1'],
		[/^(.*)/i, 'a $1'],
	],
	uppercase: [[/(.*)/i, function (m, $1) {
		return $1.toUpperCase()
	}]],
	uppercaseFirst: [[/(.*)/i, function (m, $1) {
		return $1.substring(0, 1).toUpperCase() + $1.substring(1, $1.length)
	}]],
}
