'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('browserify', ['eslint', 'templates'], function() {

  var isProd = process.env.NODE_ENV === 'production';

  if (isProd) {
    /**
     * Uglify output, omit sourcemaps
     */
    return browserify({
      entries: './src/app.init.js',
      transform: ['require-globify']
    })
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(uglify()) // pack
    .pipe(gulp.dest('./dist/js'));

  } else {
    /**
     * Generate sourcemaps, do not uglify
     */
    return browserify({
      entries: './src/app.init.js',
      transform: ['require-globify'],
      debug: true
    })
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({
      loadMaps: true
    })) // load browserify maps
    .pipe(sourcemaps.write('./')) // write external sourcemap file
    .pipe(gulp.dest('./dist/js'));

  }

});
