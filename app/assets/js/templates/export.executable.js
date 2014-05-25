(function() {
	var Baba = (function() { __GENERATOR__ })()

	var path = require('path')
	var args = process.argv.slice(2)
	var validMethods = Object.keys(Baba.generator)
	var validVariables = Object.keys(Baba.variable.obj)
	var output = []

	function usage() {
		process.stdout.write([
			'__GENERATOR_NAME__ by __GENERATOR_AUTHOR__',
			'',
			'Made with Baba: http://baba.computer/',
			'',
			'Usage:',
			'',
			'    ' + path.basename(process.argv[1]) +
				validVariables.map(function(el) { return ' [ --' + el + '=VALUE ]' }).join('') +
				' [ ' + validMethods.join(' | ') + ' ]',
			'',
			'',
		].join('\n'))
		process.exit(1)
	}
	if (!args.length) { usage() }
	args.some(function(arg) {
		try {
			if (arg.substr(0, 2) === '--') {
				var variable = arg.substr(2).split('=')
				if (validVariables.indexOf(variable[0]) === -1) {
					throw 'Invalid variable: ' + variable[0]
				}
				Baba.variable.set(variable[0], variable[1])
			} else {
				if (validMethods.indexOf(arg) === -1) {
					throw 'Invalid generator: ' + arg
				}
				output.push(Baba.generator[arg]())
			}
		}
		catch (e) {
			process.stdout.write(e + '\n\n')
			usage()
			return true
		}
	})
	process.stdout.write(output.join('\n\n') + '\n')
})()
