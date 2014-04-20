Baba.registerGrammar('common', function(require, res, tf, $, $var) {
	function replaceRegexp(rules, str) {
		var ret
		str = $(str)()
		rules.some(function (filter) {
			if (str.match(filter[0])) {
				ret = str.replace(filter[0], filter[1])
				return true
			}
		})
		return ret
	}

	tf({
		prefixAn: function (str) {
			str = $(str)()
			if (str[0].match(/[aeiou]/)) {
				return 'an ' + str
			}
			return 'a ' + str
		},
		ucFirst: function (str) {
			str = $(str)()
			return str.substring(0, 1).toUpperCase() + str.substring(1, str.length)
		},
		uc: function (str) {
			str = $(str)()
			return str.toUpperCase()
		},
		lc: function (str) {
			str = $(str)()
			return str.toLowerCase()
		},

		verbTPast: replaceRegexp.bind(this, [
			// exceptions
			[/^((re)?set)$/i, '$1'],
			[/^(send)$/i, 'sent'],
			[/^(show)$/i, 'shown'],
			[/^(checkout)$/i, 'checked out'],
			// general rules
			[/(.*[^aeiouy][aeiouy])([bcdfglmpstvz])$/i, '$1$2$2ed'],
			[/(.*)e$/i, '$1ed'],
			[/(.*)y$/i, '$1ied'],
			[/(.*)/i, '$1ed'],
		]),
		verbTPresent: replaceRegexp.bind(this, [
			// exceptions
			[/^(checkout)$/i, 'checks out'],
			// general rules
			[/(.*)ex$/i, '$1exes'],
			[/(.*)([^aeo])y$/i, '$1$2ies'],
			[/(.*)([sc]h|s)$/i, '$1$2es'],
			[/(.*)/i, '$1s'],
		]),
		verbTPP: replaceRegexp.bind(this, [
			// exceptions
			[/^(checkout)$/i, 'checking out'],
			// general rules
			[/(.*[^aeiouy][aeiouy])([bcdfglmpstvz])$/i, '$1$2$2ing'],
			[/(.*)e$/i, '$1ing'],
			[/(.*)$/i, '$1ing'],
		]),
		verbAppendIze: replaceRegexp.bind(this, [
			// general rules
			[/(.*)[aeiouy]$/i, '$1ize'],
			[/(.*)$/i, '$1ize'],
		]),

		nounPlural: replaceRegexp.bind(this, [
			// exceptions
			[/(.*)man$/i, '$1men'],
			[/(womyn)$/i, 'wymyn'],
			[/(person)$/i, 'people'],
			// general rules
			[/(.*)ife$/i, '$1ives'],
			[/(.*)ex$/i, '$1ices'],
			[/(.*)([^ou])y$/i, '$1$2ies'],
			[/(.*)([sc]h|s)$/i, '$1$2es'],
			[/(.*)/i, '$1s'],
		]),

		adjAppendIty: replaceRegexp.bind(this, [
			// general rules
			[/(.*)eme$/i, '$1emacy'],
			[/(.*)([ia])ble$/i, '$1$2bility'],
			[/(.*)([tv])e$/i, '$1$2eness'],
			[/(.*)[aeiouy]$/i, '$1ity'],
			[/(.*)$/i, '$1ity'],
		]),
		adjAppendLy: replaceRegexp.bind(this, [
			// general rules
			[/(.*)ic$/i, '$1ically'],
			[/(.*)[aeiouy]$/i, '$1y'],
			[/(.*)$/i, '$1ly'],
		])
	})
})
