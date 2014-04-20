/*!
 * baba.js - JavaScript garbage text generator inspired by the Dada Engine
 *
 * Author: Kim Silkebækken
 *
 * https://github.com/Lokaltog/baba
 */

(function (global, module, define) {
	function randomItem(items) {
		return items[Math.floor(Math.random() * items.length)]
	}

	// Wrapper to make an object gettable/settable
	// func(name) gets a value, and func(name, value) or func(map) sets one or multiple values
	function _register(reg) {
		return function(name, value) {
			if (typeof value === 'undefined') {
				if (typeof name !== 'object') {
					return reg[name]
				}
				for (var key in name) {
					if (name.hasOwnProperty(key)) {
						reg[key] = name[key]
						return reg
					}
				}
			}
			reg[name] = value
			return reg
		}
	}

	// Wrapper to allow referring to variables in the grammar before they're provided by Grammar.render()
	function BoundVariable(name, defaultValue) {
		this.get = function (variables) {
			return (variables || {}).hasOwnProperty(name) ? variables[name] : defaultValue
		}
	}

	function _bindVariable(name, defaultValue) {
		return new BoundVariable(name, defaultValue)
	}

	// Global Baba object
	var Baba = global.Baba = {
		__grammars__: {},
		registerGrammar: function (name, init) {
			Baba.__grammars__[name] = new Baba.GrammarDefinition(init)
		},

		Grammar: function (grammarName) {
			var grammar = Baba.__grammars__[grammarName]

			this.render = function (resource, variables) {
				return grammar.parseValue(grammar.res(resource))(variables)
			}
		},
		GrammarDefinition: function (init) {
			var registeredResources = _register({})
			var registeredTransforms = _register({})

			// Use shorter variables
			this.res = registeredResources
			this.tf = registeredTransforms

			this.parseValue = function parseValue() {
				var args = arguments
				return function(variables) {
					var ret = []
					if (variables) {
						// variables is an optional argument: do not set
						// this.variables unless we actually have a value as
						// this.variables can be used at every node in the tree
						this.variables = variables
					}

					for (var arg in args) {
						if (args.hasOwnProperty(arg)) {
							arg = args[arg]

							switch (typeof arg) {
							case 'string':
								ret.push(arg)
								break

							case 'function':
								ret.push(parseValue(arg(this.res, this.tf, parseValue, _bindVariable))())
								break

							case 'object':
								if (arg instanceof BoundVariable) {
									ret.push(parseValue(arg.get(this.variables))())
									break
								}
								if (Array.isArray(arg)) {
									ret.push(parseValue(randomItem(arg))())
									break
								}
								break

							default:
								break
							}
						}
					}
					return ret.join('')
				}.bind(this)
			}.bind(this)

			init(this.require, registeredResources, registeredTransforms, this.parseValue, _bindVariable)
		},
	}

	Baba.GrammarDefinition.prototype.require = function (grammar) {
		if (!Baba.__grammars__.hasOwnProperty(grammar)) {
			throw 'Grammar "' + grammar + '" not available!'
		}
		return Baba.__grammars__[grammar]
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
})(this,
   typeof module === 'object' && module,
   typeof define === 'function' && define)
