/*!
 * Common transforms for Baba
 *
 * Author: Kim Silkebækken
 *
 * https://github.com/Lokaltog/baba
 */

(function (global, module, define) {
	function replaceRegexp (rules, str) {
		var ret
		rules.some(function (filter) {
			if (str.match(filter[0])) {
				ret = str.replace(filter[0], filter[1])
				return true
			}
		})
		return ret
	}

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
					'past': replaceRegexp.bind(this, [
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
					'present': replaceRegexp.bind(this, [
						// exceptions
						[/^(checkout)$/i, 'checks out'],
						// general rules
						[/(.*)ex$/i, '$1exes'],
						[/(.*)([^aeo])y$/i, '$1$2ies'],
						[/(.*)([sc]h|s)$/i, '$1$2es'],
						[/(.*)/i, '$1s'],
					]),
					'present-participle': replaceRegexp.bind(this, [
						// exceptions
						[/^(checkout)$/i, 'checking out'],
						// general rules
						[/(.*[^aeiouy][aeiouy])([bcdfglmpstvz])$/i, '$1$2$2ing'],
						[/(.*)e$/i, '$1ing'],
						[/(.*)$/i, '$1ing'],
					]),
				},
				'-ize': replaceRegexp.bind(this, [
					// general rules
					[/(.*)[aeiouy]$/i, '$1ize'],
					[/(.*)$/i, '$1ize'],
				]),
			},
			'noun': {
				'plural': replaceRegexp.bind(this, [
					// exceptions
					[/^(.*)man$/i, '$1men'],
					[/^(womyn)$/i, 'wymyn'],
					[/^(person)$/i, 'people'],
					// general rules
					[/(.*)ife$/i, '$1ives'],
					[/(.*)ex$/i, '$1ices'],
					[/(.*)y$/i, '$1ies'],
					[/(.*)([sc]h|s)$/i, '$1$2es'],
					[/(.*)/i, '$1s'],
				]),
			},
			'adjective': {
				'-ity': replaceRegexp.bind(this, [
					// general rules
					[/(.*)eme$/i, '$1emacy'],
					[/(.*)([ia])ble$/i, '$1$2bility'],
					[/(.*)([tv])e$/i, '$1$2eness'],
					[/(.*)[aeiouy]$/i, '$1ity'],
					[/(.*)$/i, '$1ity'],
				]),
				'-ly': replaceRegexp.bind(this, [
					// general rules
					[/(.*)ic$/i, '$1ically'],
					[/(.*)[aeiouy]$/i, '$1y'],
					[/(.*)$/i, '$1ly'],
				])
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
