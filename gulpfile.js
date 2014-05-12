var gulp = require('gulp')
var gutil = require('gulp-util')
var stylus = require('gulp-stylus')
var nib = require('nib')
var watchify = require('watchify')
var streamify = require('gulp-streamify')
var uglify = require('gulp-uglify')
var source = require('vinyl-source-stream')
var livereload = require('gulp-livereload')
var es6ify = require('es6ify')
var jade = require('gulp-jade')
var htmlmin = require('gulp-htmlmin')
var imagemin = require('gulp-imagemin')

var __assets_src = './app/assets/'
var __assets_dest = './webroot/static/'
var __views_src = './app/views/'
var __views_dest = './webroot/'

gulp.task('stylus', function() {
	return gulp
		.src(__assets_src + 'styl/main.styl')
		.pipe(stylus({
			debug: false,
			compress: true,
			'include css': true,
			define: {
				ASSETS_PATH: 'static/', // required for smoosher
			},
			use: [
				nib(),
			],
			import: [
				'nib',
			],
		}))
		.pipe(gulp.dest(__assets_dest + 'css/'))
		.pipe(livereload())
})

gulp.task('jade', function() {
	return gulp
		.src(__views_src + '**.jade')
		.pipe(jade({
			pretty: false,
			compileDebug: true,
		}))
		.pipe(htmlmin({
			collapseBooleanAttributes: true,
			collapseWhitespace: true,
			removeAttributeQuotes: true,
			removeComments: true,
			removeEmptyAttributes: true,
			removeOptionalTags: true,
			removeRedundantAttributes: true,
			useShortDoctype: true,
			processScripts: ['text/x-template'],
		}))
		.pipe(gulp.dest(__views_dest))
		.pipe(livereload())
})

gulp.task('watchify', function() {
	var bundler = watchify(__assets_src + 'js/main.js')
	function rebundle() {
		gutil.log('Starting watchify rebundle')
		return bundler
			.transform('brfs')
			.transform(es6ify)
			.bundle({}, function () { gutil.log('Watchify rebundling done') })
			.pipe(source('js/main.js'))
			.pipe(streamify(uglify({
				mangle: true,
				compress: true,
			})))
			.pipe(gulp.dest(__assets_dest))
			.pipe(livereload())
	}
	bundler.on('update', rebundle)
	return rebundle()
})

gulp.task('uglify-static', function() {
	// libraries that don't need to be watched
	return gulp
		.src(__assets_src + 'js/lib/uglifyjs.min.js')
		.pipe(uglify())
		.pipe(gulp.dest(__assets_dest + 'js'))
})

gulp.task('sync', function() {
	return gulp
		.src(__assets_src + '{img,font}/**')
		.pipe(gulp.dest(__assets_dest))
		.pipe(livereload())
})

gulp.task('development', ['stylus', 'jade', 'watchify', 'uglify-static', 'sync'], function() {
	gulp.watch(__assets_src + 'styl/**.styl', ['stylus'])
	gulp.watch(__views_src + '**.jade', ['jade'])
})
