// init jQuery plugins

// thanks to all plugin authors that require window.jQuery instead of just jQuery, it
// makes it pretty much impossible to shim jQuery for your plugins

window.jQuery = window.$ = require('jquery')

require('./lib/standalone/jquery.autosize.input.js')
require('./lib/standalone/jquery.contextMenu.js')
require('./lib/standalone/jquery.magnific-popup.js')
require('./lib/standalone/jquery.ui.position.js')
require('./lib/standalone/typeahead.jquery.js')

// import main modules
var importGenerator = require('./import')
var ui = require('./ui')()
var vm = require('./vue/init')()
var popup = require('./popup')

popup.init(vm)

// handle gist ID/URI in query string
if (window.location.hash) {
	var split = window.location.hash.substring(1).split(':')
	switch (split[0]) {
	case 'gist':
		vm.generator = importGenerator.fromGist(split[1])
	}
}
