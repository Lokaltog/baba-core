var importGenerator = require('./import')
var ui = require('./ui')()
var vm = require('./vue/init')()
var popup = require('./popup')

// init jQuery plugins
require('./lib/standalone/jquery.autosize.input.js')
require('./lib/standalone/jquery.contextMenu.js')
require('./lib/standalone/jquery.magnific-popup.js')
require('./lib/standalone/jquery.ui.position.js')

popup.init(vm)

// handle gist ID/URI in query string
if (window.location.hash) {
	var split = window.location.hash.substring(1).split(':')
	switch (split[0]) {
	case 'gist':
		vm.generator = importGenerator.fromGist(split[1])
	}
}
