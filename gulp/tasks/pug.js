'use strict';

var gulp = require('gulp');
var pug = require('gulp-pug');
var pkg = require('../../package.json');

gulp.task('pug', function() {

  var locals = {
    env: process.env.NODE_ENV,
    title: pkg.nameFriendly,
    css: 'css/app.css',
    cssMin: 'css/app.min.css',
    js: 'js/app.js',
    jsMin: 'js/app.min.js',
    appName: pkg.name
  };

  return gulp.src('./src/index.pug')
    .pipe(pug({
      locals: locals,
      pretty: locals.env !== 'production'
    }))
    .pipe(gulp.dest('./dist'));

});
