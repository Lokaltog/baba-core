(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory)
	}
	else if (typeof exports === 'object') {
		module.exports = factory()
	}
	else {
		root.__MODULE_NAME__ = factory()
	}
}(this, function() {
	__GENERATOR__
}))
