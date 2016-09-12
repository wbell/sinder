'use strict';

var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var templateCache = require('gulp-angular-templatecache');
var templateOptions = {
  module: 'lennarCRM.templatesModule',
  standalone: true,
  moduleSystem: 'Browserify',
  root: './src'
};

gulp.task('templates', function(){

  return gulp.src('./src/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(templateCache('templates.module.js', templateOptions))
    .pipe(gulp.dest('./src/components/templates'));

});
