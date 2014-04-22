module.exports = function (grunt) {
	var matchdep = require('matchdep'),
	    jsFiles,
	    stylFiles,
	    jadeFiles

	matchdep.filter('grunt-*').forEach(grunt.loadNpmTasks)

	jsFiles = {
		'webroot/static/js/main.js': [
			'app/assets/js/utils.js',
			'app/assets/js/main.js',
		],
	}
	stylFiles = [{
		'webroot/static/css/main.css': [
			'app/assets/styl/main.styl',
		],
	}]
	jadeFiles = [{
		expand: true,
		cwd: 'app/views',
		src: '**/*.jade',
		dest: 'webroot/',
		ext: '.html',
	}]

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: {
			smooshed: [
				'webroot/views',
				'webroot/static/{css,js}',
			],
			all: [
				'webroot/{static,views}',
			],
		},
		sync: {
			all: {
				files: [{
					cwd: 'app/assets',
					src: '{font,img,etc}/**',
					dest: 'webroot/static/',
				}],
			},
		},
		stylus: {
			development: {
				files: stylFiles,
				options: {
					debug: true,
					compress: false,
					'include css': true,
					define: {
						ASSETS_PATH: '../',
					},
					use: [
						require('nib'),
					],
					'import': [
						'nib',
					],
				},
			},
			production: {
				files: stylFiles,
				options: {
					debug: false,
					compress: true,
					'include css': true,
					'resolve url': true,
					define: {
						ASSETS_PATH: 'static/', // required for smoosher
					},
					use: [
						require('nib'),
					],
					'import': [
						'nib',
					],
				},
			},
		},
		jade: {
			development: {
				files: jadeFiles,
				options: {
					pretty: true,
					compileDebug: true,
				},
			},
			production: {
				files: jadeFiles,
				options: {
					pretty: false,
					compileDebug: false,
				},
			},
		},
		htmlmin: {
			development: {
				options: {
					removeEmptyAttributes: true,
					removeOptionalTags: true,
					removeRedundantAttributes: true,
					useShortDoctype: true,
				},
				files: [{
					expand: true,
					cwd: 'webroot/',
					src: '**/*.html',
					dest: 'webroot/',
				}],
			},
			production: {
				options: {
					collapseBooleanAttributes: true,
					collapseWhitespace: true,
					removeAttributeQuotes: true,
					removeComments: true,
					removeEmptyAttributes: true,
					removeOptionalTags: true,
					removeRedundantAttributes: true,
					useShortDoctype: true,
				},
				files: [{
					expand: true,
					cwd: 'webroot/',
					src: '**/*.html',
					dest: 'webroot/',
				}],
			},
		},
		uglify: {
			development: {
				files: jsFiles,
				options: {
					compress: {
						global_defs: {
							DEBUG: true,
						},
					},
					beautify: true,
					mangle: false,
					warnings: true,
				},
			},
			production: {
				files: jsFiles,
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
						toplevel: false,
					},
					warnings: true,
				},
			},
		},
		watch: {
			options: {
				spawn: false,
				atBegin: true,
			},
			sync: {
				files: ['app/assets/{img,font,etc}/**'],
				tasks: ['sync:all'],
			},
			uglify: {
				files: ['app/assets/js/**/*.js'],
				tasks: ['uglify:development'],
			},
			stylus: {
				files: ['app/assets/styl/**/*.styl'],
				tasks: ['stylus:development'],
			},
			jade: {
				files: ['app/views/**/*.jade'],
				tasks: ['jade:development', 'htmlmin:development'],
			},
			livereload: {
				files: ['webroot/static/css/**/*.css'],
				tasks: [],
				options: {
					livereload: true,
				},
			},
		},
		smoosher: {
			all: {
				files: {
					'webroot/index.html': 'webroot/index.html',
				},
			},
		},
	})

	grunt.registerTask('development', [
		'watch',
	])

	grunt.registerTask('production', [
		'clean:all',
		'sync:all',
		'stylus:production',
		'jade:production',
		'uglify:production',
		'htmlmin:production',
		'smoosher:all',
		'clean:smooshed',
	])
}
