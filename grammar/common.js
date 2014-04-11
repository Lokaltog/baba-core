/*!
 * baba/transforms/common - Common transforms for Baba
 *
 * Author: Kim Silkebækken
 *
 * https://github.com/Lokaltog/baba
 */

if (typeof babaTransforms === 'undefined') var babaTransforms = {}

babaTransforms.common = {
	__common__: {
		'prepend-an': function (str) {
			if (str[0].match(/[aeiou]/)) {
				return 'an ' + str
			}
			return 'a ' + str
		},
		'uppercase-first': function (str) {
			return str.substring(0, 1).toUpperCase() + str.substring(1, str.length)
		},
		'uppercase': function (str) {
			return str.toUpperCase()
		},
		'lowercase': function (str) {
			return str.toLowerCase()
		},
		'constantify': function (str) {
			return str.toUpperCase().replace(/[^a-z0-9]/gi, '_')
		},
	},
	verb: {
		tense: {
			past: function (str) {
				[
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
				].some(function (filter) {
					if (str.match(filter[0])) {
						ret = str.replace(filter[0], filter[1])
						return true
					}
				})
				return ret
			},
			present: function (str) {
				[
					// exceptions
					[/^(checkout)$/i, 'checks out'],
					// general rules
					[/(.*)ex$/i, '$1exes'],
					[/(.*)y$/i, '$1ies'],
					[/(.*)([sc]h|s)$/i, '$1$2es'],
					[/(.*)/i, '$1s'],
				].some(function (filter) {
					if (str.match(filter[0])) {
						ret = str.replace(filter[0], filter[1])
						return true
					}
				})
				return ret
			},
			'present-participle': function (str) {
				[
					[/(.*[^aeiouy][aeiouy])([bcdfglmpstvz])$/i, '$1$2$2ing'],
					[/(.*)e$/i, '$1ing'],
					[/(.*)$/i, '$1ing'],
				].some(function (filter) {
					if (str.match(filter[0])) {
						ret = str.replace(filter[0], filter[1])
						return true
					}
				})
				return ret
			},
		},
	},
	noun: {
		plural: function (str) {
			[
				[/(.*)ex$/i, '$1ices'],
				[/(.*)y$/i, '$1ies'],
				[/(.*)([sc]h|s)$/i, '$1$2es'],
				[/(.*)/i, '$1s'],
			].some(function (filter) {
				if (str.match(filter[0])) {
					ret = str.replace(filter[0], filter[1])
					return true
				}
			})
			return ret
		},
	},
}
