module.exports = function (grunt) {
	var matchdep = require('matchdep')

	matchdep.filter('grunt-*').forEach(grunt.loadNpmTasks)

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uglify: {
			production: {
				files: {
					'baba.min.js': ['baba.js'],
				},
				options: {
					compress: {
						drop_console: true,
						unsafe: true,
						global_defs: {
							DEBUG: false,
						},
					},
					beautify: false,
					mangle: {
						toplevel: true,
					},
					warnings: true,
				},
			},
		},
	})

	grunt.registerTask('default', ['uglify:production'])
}
