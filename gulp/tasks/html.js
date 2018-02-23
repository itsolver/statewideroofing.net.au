'use strict';
var gulp       = require('gulp');
var gutil      = require('gulp-util');
var critical   = require('critical').stream;
var argv       = require('yargs').argv;
var htmlmin    = require('gulp-htmlmin');
var prettyData = require('gulp-pretty-data');
var size       = require('gulp-size');
var when       = require('gulp-if');

// include paths file
var paths      = require('../paths');

// 'gulp html' -- does nothing
// 'gulp html --prod' -- minifies HTML files for production
gulp.task('html', () => {
  return gulp.src(paths.siteFolderName + paths.htmlPattern)
    .pipe(when(argv.prod, htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: false,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      removeEmptyElements: false,
      removeRedundantAttributes: true,
      minifyJS: true,
      minifyCSS: true
    })))
    .pipe(when(argv.prod, size({title: 'optimized HTML'})))
    .pipe(when(argv.prod, gulp.dest(paths.siteFolderName)))
});

// 'gulp xml' -- does nothing
// 'gulp xml' --prod'  -- minifies XML and JSON files for production
gulp.task('xml', () => {
  return gulp.src(paths.siteFolderName + paths.xmlPattern)
    .pipe(when(argv.prod, prettyData({
      type: 'minify',
      preserveComments: false
    })))
    .pipe(when(argv.prod, size({title: 'optimized XML'})))
    .pipe(when(argv.prod, gulp.dest(paths.siteFolderName)))
});

// Page dimensions for critical CSS
var pageDimensions = [{
                        width: 320,
                        height: 480
                      }, {
                        width: 768,
                        height: 1024
                      }, {
                        width: 1024,
                        height: 1024
                      }, {
                        width: 1440,
                        height: 1280
                      }];

// 'gulp styles:critical:home' -- Generate, minify and inline critical-path CSS
gulp.task('styles:critical:home', () => {
  return gulp.src(paths.siteDir + 'index.html')
    .pipe(when(argv.prod,critical({
      base: paths.siteDir,
      inline: true,
      dimensions: pageDimensions,
      css: paths.sassFilesSite + '/main.css',
      dest: 'index.html',
      minify: true,
      extract: false,
      timeout: 30000,
      ignore: ['@font-face]'] // defer loading of webfonts
    })))
    .on('error', function(err) { gutil.log(gutil.colors.red(err.message)); })
});

// 'gulp styles:critical:archive' -- Generate, minify and inline critical-path CSS
gulp.task('styles:critical:archive', () => {
  return gulp.src(paths.siteDir + '/archived/index.html')
    .pipe(critical({
      base: paths.siteDir,
      inline: true,
      dimensions: pageDimensions,
      css: paths.sassFilesSite + '/main.css',
      dest: 'archived/index.html',
      minify: true,
      extract: false,
      timeout: 30000,
      ignore: ['@font-face'] // defer loading of webfonts
    }))
    .on('error', function(err) { gutil.log(gutil.colors.red(err.message)); })
});

// 'gulp styles:critical:post' -- Generate, minify and inline critical-path CSS
gulp.task('styles:critical:post', () => {
  return gulp.src(paths.siteDir + '/blog/index.html')
    .pipe(critical({
      base: paths.siteDir,
      inline: true,
      dimensions: pageDimensions,
      css: paths.sassFilesSite + '/main.css',
      dest: 'blog/index.html',
      minify: true,
      extract: false,
      timeout: 30000,
      ignore: ['@font-face'] // defer loading of webfonts
    }))
    .on('error', function(err) { gutil.log(gutil.colors.red(err.message)); })
});
