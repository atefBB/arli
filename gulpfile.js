'use strict';

// Requiring modules
var gulp        = require('gulp');
var rm          = require('rimraf');
var $           = require('gulp-load-plugins')();

// Containing project constants
var config = {
  entryFile: './src/index.js',
  testFile: '/test/index.js',
  outputDir: './dist/',
  outputFile: 'arli.js',
};

// Cleaning the dist folder
gulp.task('clean', function(cb) {
  rm(config.outputDir, cb);
});

// Check errors and code style
gulp.task('lint', function() {
  return gulp.src(['./gulpfile.js', './src/*.js'])
    .pipe($.jshint())
    .pipe($.jshint.reporter('default', { verbose: true }))
    .pipe($.jshint.reporter('fail'))
    .pipe($.jscs())
    .pipe($.jscs.reporter())
    .pipe($.jscs.reporter('fail'));
});

// Building the main script with a minefied version and a sourcemap with it after babeling it
gulp.task('build', ['clean', 'lint'], function() {
  gulp.src(config.entryFile)
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      presets: ['es2015'],
    }))
    .pipe($.rename('arli.js'))
    .pipe($.sourcemaps.write('.'))
    .pipe($.size({title: 'arli.js'}))
    .pipe(gulp.dest(config.outputDir));

  return gulp.src(config.entryFile)
    .pipe($.sourcemaps.init())
    .pipe($.uglify({
      preserveComments: 'license',
    }))
    .pipe($.rename('arli.min.js'))
    .pipe($.sourcemaps.write('.'))
    .pipe($.size({title: 'arli.min.js'}))
    .pipe(gulp.dest(config.outputDir));
});

// Testing arli
gulp.task('test', function() {
  return gulp.src(config.testFile, {read: false})
    .pipe($.mocha({reporter: 'list', globals: ['arli']}));
});
