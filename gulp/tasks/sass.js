'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var sassGlob = require('gulp-sass-glob');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function() {

  var isProd = process.env.NODE_ENV === 'production';
  var flow = null;
  var paths = {
    entry: './src/scss/app.scss',
    output: './dist/css'
  };

  if(isProd){

    flow = gulp.src(paths.entry)
      .pipe(sassGlob())
      .pipe(
        sass()
        .on('error', sass.logError)
      )
      .pipe(cleanCSS())
      .pipe(rename('app.min.css'))
      .pipe(gulp.dest(paths.output));

  } else {

    flow = gulp.src(paths.entry)
      .pipe(sassGlob())
      .pipe(sourcemaps.init())
      .pipe(
        sass()
        .on('error', sass.logError)
      )
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(paths.output));

  }

  return flow;

});
