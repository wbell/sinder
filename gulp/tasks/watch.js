'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var config = {
  ui: false,
  files: ['./dist/**/*.js', './dist/**/*.html', './dist/**/*.css'],
  server: {
    baseDir: './dist',
    index: 'index.html'
  },
  port: 8800,
  ghostMode: false,
  injectChanges: true
};

gulp.task('watch', function() {

  browserSync.init(config);

  gulp.watch(['./src/**/*.html', './src/**/*.js', './package.json'], ['browserify']);
  gulp.watch(['./src/scss/**/*.scss','./src/components/**/*.scss'], ['sass']);
});
