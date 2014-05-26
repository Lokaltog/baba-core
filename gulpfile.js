var info = require('./package.json')

var gulp = require('gulp')
var stylus = require('gulp-stylus')
var nib = require('nib')
var livereload = require('gulp-livereload')
var jade = require('gulp-jade')
var htmlmin = require('gulp-htmlmin')
var gutil = require('gulp-util')
var inline = require('gulp-inline')
var clean = require('gulp-clean')
var webpack = require('webpack')

var __assets_src = './app/assets/'
var __assets_dest = './webroot/static/'
var __views_src = './app/views/'
var __views_dest = './webroot/'

var config = {
	development: {
		stylus: {
			debug: true,
			compress: false,
			'include css': true,
			define: {
				ASSETS_PATH: 'static/', // required for smoosher
				DEV: true,
			},
			use: [
				nib(),
			],
			import: [
				'nib',
			],
		},
		jade: {
			pretty: false,
			compileDebug: true,
		},
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
		webpack: {
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
		},
	},
	production: {
		stylus: {
			debug: false,
			compress: true,
			'include css': true,
			define: {
				ASSETS_PATH: 'static/', // required for smoosher
				DEV: false,
			},
			use: [
				nib(),
			],
			import: [
				'nib',
			],
		},
		jade: {
			pretty: false,
			compileDebug: false,
		},
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
		webpack: {
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
		},
	},
}
var activeConfig = config.production

gulp.task('stylus', function() {
	return gulp
		.src(__assets_src + 'styl/main.styl')
		.pipe(stylus(activeConfig.stylus))
		.pipe(gulp.dest(__assets_dest + 'css/'))
		.pipe(livereload())
})

gulp.task('jade', function() {
	return gulp
		.src(__views_src + '**.jade')
		.pipe(jade(activeConfig.jade))
		.pipe(htmlmin(activeConfig.htmlmin))
		.pipe(gulp.dest(__views_dest))
		.pipe(livereload())
})

gulp.task('webpack', function(callback) {
	webpack(
		{
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
			plugins: activeConfig.webpack.plugins,
		},
		function(err, stats) {
			if(err) {
				throw new gutil.PluginError('webpack', err)
			}
			gutil.log('Webpack', stats.toString())
			livereload().changed(__assets_dest + 'js/main.js')
			callback()
		})
})

gulp.task('inline', ['stylus', 'jade', 'webpack', 'sync'], function() {
	return gulp
		.src(__views_dest + 'index.html')
		.pipe(inline({
			base: __views_dest,
		}))
		.pipe(gulp.dest(__views_dest))
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
		.pipe(livereload())
})

// handle dev/prod config
gulp.task('set-env-dev', function() {
	activeConfig = config.development
})

gulp.task('set-env-prod', function() {
	activeConfig = config.production
})

// main tasks
gulp.task('development', ['set-env-dev', 'stylus', 'jade', 'webpack', 'sync'], function() {
	gulp.watch(__assets_src + '{js/**.js,js/**/**.js}', ['webpack'])
	gulp.watch(__assets_src + 'styl/**.styl', ['stylus'])
	gulp.watch(__views_src + '**.jade', ['jade'])
})
gulp.task('production', ['set-env-prod', 'inline'], function() {})
