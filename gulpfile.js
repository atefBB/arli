var gulp = require('gulp');
var pkg = require('./package.json');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');

var CONFIG = {
  concatFiles: [
    './src/wrapper/start.js',
    './src/constants/*.js',
    './src/helpers/*.js',
    './src/*.js',
    './src/wrapper/end.js',
    ],
  dest: './dist/',
  jsFiles: [
    './*.js',
    './src/*.js',
    './src/constants/*.js',
    './src/helpers/*.js',
    './test/*.js',
    './dist/arli.js',
  ],
  testFile: './test/index.js',
  watchFiles: [
    './*',
    './src/**/*',
    './test/*',
  ],
};

gulp.task('lint', function() {
  return gulp.src(CONFIG.jsFiles)
    .pipe(plugins.jscs())
    .pipe(plugins.jscs.reporter())
    .pipe(plugins.jscs.reporter('fail'));
});

gulp.task('concat', function() {
  gulp.src(CONFIG.concatFiles)
    .pipe(plugins.sourcemaps.init())
      .pipe(plugins.concat('arli.js'))
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/'));

  return gulp.src(CONFIG.concatFiles)
    .pipe(plugins.sourcemaps.init())
      .pipe(plugins.concat('arli.js'))
      .pipe(plugins.rename('arabic.min.js'))
      .pipe(plugins.uglify())
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('pre-test', function() {
  return gulp.src(pkg.main)
    .pipe(plugins.istanbul())
    .pipe(plugins.istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function() {
  return gulp.src(CONFIG.testFile)
    .pipe(plugins.mocha({
      reporter: 'spec',
      require: ['should'],
    }))
    .pipe(plugins.istanbul.writeReports())
    .pipe(plugins.istanbul.enforceThresholds({thresholds: {global: 90}}));
});

gulp.task('default', ['build'], function() {
  gulp.watch(CONFIG.watchFiles, function() {
    runSequence(
      'lint',
      'concat'
    );
  });
});

gulp.task('build', function() {
  runSequence(
    'lint',
    'concat',
    'test'
  );
});
