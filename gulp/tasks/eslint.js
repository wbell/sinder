'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');

gulp.task('eslint', function(){

  return gulp.src(['./src/**/*.js', '!./src/libs/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});
