/*!
 * Common transforms for Baba
 *
 * Author: Kim Silkebækken
 *
 * https://github.com/Lokaltog/baba
 */

(function (global, module, define) {
	function init (Baba) {
		var grammar = new Baba.Grammar('common')

		grammar.addTransforms({
			'__common__': {
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
			},
			'verb': {
				'tense': {
					'past': function (str) {
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
					'present': function (str) {
						[
							// exceptions
							[/^(checkout)$/i, 'checks out'],
							// general rules
							[/(.*)ex$/i, '$1exes'],
							[/(.*)([^aeo])y$/i, '$1$2ies'],
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
							// exceptions
							[/^(checkout)$/i, 'checking out'],
							// general rules
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
			'noun': {
				'plural': function (str) {
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
		})
	}

	// Export as either CommonJS or AMD module
	if (typeof module === 'object' && module.exports) {
		module.exports = init
	}
	else if (typeof define === 'function' && define.amd) {
		define(function () {
			return init
		})
	}
	else {
		// Initialize from global object, e.g. if running in browser
		init(global.Baba)
	}
})(this,
   (typeof module !== 'undefined' ? module : false),
   (typeof define !== 'undefined' ? define : false))
