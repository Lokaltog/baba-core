/*!
 * {{{generatorName}}} by {{{generatorAuthor}}}
 *
 * Made with Baba: http://baba.computer/
 */
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory)
	}
	else if (typeof exports === 'object') {
		module.exports = factory()
	}
	else {
		root.{{{moduleName}}} = factory()
	}
}(this, function() {
	{{{generator}}}
}))
