var info = require('./package.json')

var fs = require('fs')
var flo = require('fb-flo')
var gulp = require('gulp')
var stylus = require('gulp-stylus')
var nib = require('nib')
var jade = require('gulp-jade')
var htmlmin = require('gulp-htmlmin')
var gutil = require('gulp-util')
var inline = require('gulp-inline')
var clean = require('gulp-clean')
var webpack = require('webpack')
var webpackCompiler

// common config
var config = {
	htmlmin: {
		collapseBooleanAttributes: true,
		collapseWhitespace: true,
		removeAttributeQuotes: true,
		removeComments: true,
		removeEmptyAttributes: true,
		removeOptionalTags: true,
		removeRedundantAttributes: true,
		useShortDoctype: true,
		processScripts: ['text/x-template'],
	},
}

var __assets_src = './app/assets/'
var __assets_dest = './webroot/static/'
var __views_src = './app/views/'
var __views_dest = './webroot/'
var globs = {
	js: __assets_src + 'js/**/*.js',
	styl: __assets_src + 'styl/**/**.styl',
	jade: __views_src + '**/*.jade',
}

gulp.task('stylus', function() {
	return gulp
		.src(globs.styl)
		.pipe(stylus(config.stylus))
		.pipe(gulp.dest(__assets_dest + 'css/'))
})

gulp.task('jade', function() {
	return gulp
		.src(globs.jade)
		.pipe(jade(config.jade))
		.pipe(htmlmin(config.htmlmin))
		.pipe(gulp.dest(__views_dest))
})

gulp.task('webpack', function(callback) {
	webpackCompiler.run(function(err, stats) {
		if (err) {
			throw new gutil.PluginError('webpack', err)
		}

		gutil.log('webpack', stats.toString({
			colors: true,
		}))

		callback()
	})
})

gulp.task('clean', function() {
	return gulp
		.src('./webroot/*', {read: false})
		.pipe(clean())
})

gulp.task('sync', function() {
	return gulp
		.src(__assets_src + '{img,font}/**')
		.pipe(gulp.dest(__assets_dest))
})

gulp.task('flo', function() {
	flo(
		'webroot/',
		{
			port: 8888,
			host: 'localhost',
			glob: [
				'**/*.{css,html}',
				'**/main.bundle.js',
			]
		},
		function(filepath, callback) {
			gutil.log('Reloading \'' + gutil.colors.cyan(filepath) + '\' with flo...')
			callback({
				resourceURL: '/' + filepath,
				contents: fs.readFileSync('./webroot/' + filepath).toString(),
				reload: filepath.match(/\.(js|html)$/),
			})
		})
})

// handle dev/prod config
gulp.task('set-env-dev', function() {
	config.stylus = {
			debug: true,
			compress: false,
			'include css': true,
			define: {
				DEV: true,
			},
			use: [
				nib(),
			],
			import: [
				'nib',
			],
		}
	config.jade = {
		pretty: false,
		compileDebug: true,
	}
	config.webpack = {
		cache: true,
		debug: true,
		devtool: 'source-map',
		entry: {
			main: __assets_src + 'js/main.js',
		},
		output: {
			path: __assets_dest + 'js/',
			filename: '[name].bundle.js',
			chunkFilename: '[id].chunk.js',
			publicPath: '/static/js/',
		},
		plugins: [
			new webpack.BannerPlugin(info.name + '\n' + info.version + ':' + Date.now() + ' [development build]'),
			new webpack.DefinePlugin({
				DEV: true,
			}),
			new webpack.ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery',
			}),
		]
	}
	webpackCompiler = webpack(config.webpack)
})

gulp.task('set-env-prod', function() {
	config.stylus = {
		debug: false,
		compress: true,
		'include css': true,
		define: {
			DEV: false,
		},
		use: [
			nib(),
		],
		import: [
			'nib',
		],
	}
	config.jade = {
		pretty: false,
		compileDebug: false,
	}
	config.webpack = {
		cache: true,
		entry: {
			main: __assets_src + 'js/main.js',
		},
		output: {
			path: __assets_dest + 'js/',
			filename: '[name].bundle.js',
			chunkFilename: '[id].chunk.js',
			publicPath: '/static/js/',
		},
		plugins: [
			new webpack.BannerPlugin(info.name + '\n' + info.version + ':' + Date.now() + ' [production build]'),
			new webpack.DefinePlugin({
				DEV: false,
			}),
			new webpack.ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery',
			}),
			new webpack.optimize.DedupePlugin(),
			new webpack.optimize.AggressiveMergingPlugin(),
			new webpack.optimize.UglifyJsPlugin()
		]
	}
	webpackCompiler = webpack(config.webpack)
})

gulp.task('inline', ['stylus', 'jade', 'webpack', 'sync'], function() {
	return gulp
		.src(__views_dest + 'index.html')
		.pipe(inline({
			base: __views_dest,
		}))
		.pipe(gulp.dest(__views_dest))
})

// main tasks
gulp.task('development', ['set-env-dev', 'stylus', 'jade', 'webpack', 'sync', 'flo'], function() {
	gulp.watch(globs.js, ['webpack'])
	gulp.watch(globs.styl, ['stylus'])
	gulp.watch(globs.jade, ['jade'])
})
gulp.task('production', ['set-env-prod', 'inline'], function() {})
