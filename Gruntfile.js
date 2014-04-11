module.exports = function (grunt) {
	var matchdep = require('matchdep')

	matchdep.filter('grunt-*').forEach(grunt.loadNpmTasks)

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uglify: {
			production: {
				files: [{
					expand: true,
					cwd: 'src',
					src: 'baba.js',
					dest: 'dest',
					ext: '.min.js',
				}, {
					expand: true,
					cwd: 'src',
					src: 'grammar/*.js',
					dest: 'dest',
					ext: '.min.js',
				}],
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
