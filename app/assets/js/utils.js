var $ = function (selector, el) {
	if (!el) {
		el = document
	}
	return el.querySelector(selector)
}

var show = function () {
	for (var i = 0; i < arguments.length; i += 1) {
		arguments[i].parentNode.style.display = 'inline-block'
	}
}

var hide = function () {
	for (var i = 0; i < arguments.length; i += 1) {
		arguments[i].parentNode.style.display = 'none'
	}
}
