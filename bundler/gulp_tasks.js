'use strict';

// TODO: move this variables to external config files
var coreFilepath = './oakwood.scss';
var compiledFilename = 'oakwood.css';
var compiledPath = './compiled';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy: false});
var debug = require('gulp-debug');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var csso = require('gulp-csso');
var autoprefixer = require('autoprefixer');

var nsBuilder = require('./postcss_nsbuilder');

var postcssPreprocessors = [
  nsBuilder(),
  autoprefixer({browsers: ['last 2 version']})
];


// TODO: should copy dependent fonts and images to <compiled> folder so
gulp.task('compile', function () {
  return gulp.src(coreFilepath)
    // sass compiling
    .pipe(debug({title: 'sass:'}))
    .pipe(sass().on('error', sass.logError))

    // postcss compiling
    .pipe(debug({title: 'postcss:'}))
    .pipe(postcss(postcssPreprocessors))

    // put to destination
    .pipe(debug({title: 'compiled:'}))
    .pipe($.rename(compiledFilename))
    .pipe(gulp.dest(compiledPath))

    // compile minified version
    .pipe($.size())
    .pipe(csso())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest(compiledPath))
    .pipe($.size());
});

gulp.task('builder', ['compile'], function () {
  gulp.watch(coreFilepath, ['compile']);
});