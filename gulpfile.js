'use strict';

var gulp = require('gulp');
var jscs = require('gulp-jscs');
var mocha = require('gulp-mocha');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

gulp.task('jscs', function() {
  return gulp.src(['./*.js', './src/*.js', './test/*.js'])
    .pipe(jscs())
    .pipe(jscs.reporter());
});

gulp.task('uglify', function() {
  gulp.src('./src/index.js')
    .pipe(rename('arli.js'))
    .pipe(gulp.dest('./dist/'));

  return gulp.src('./src/index.js')
    .pipe(rename('arli.min.js'))
    .pipe(sourcemaps.init())
    .pipe(uglify({
      preserveComments: 'license',
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('test', function() {
  return gulp.src('./test/index.js')
    .pipe(mocha({
      reporter: 'spec',
      require: ['should'],
    }))
    .once('error', function() {
      process.exit(1);
    });
});

gulp.task('watch', function() {
  gulp.watch(['./*.js', './src/*.js', './test/*.js'], ['default']);
});

gulp.task('default', function() {
  runSequence('jscs', 'test');
});

gulp.task('build', function() {
  runSequence('jscs', 'test', 'uglify');
});
