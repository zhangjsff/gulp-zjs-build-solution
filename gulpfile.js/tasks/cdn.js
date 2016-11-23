var gulp = require('gulp');
var gutil = require('gulp-util');
var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();
var cdn = require('../bin/fileCompare.js');
var global = require('../config')();



gulp.task('cdn',function(){
  gutil.log('****** cdn upload started *******')
  gutil.log('****** if failed you can use ',  gutil.colors.grey('gulp cdn -n [projectName]')  ,' directly *******');
  console.log(global.onlineStaticDir + '**/*')
  return gulp.src(global.onlineStaticDir + '**/*')
    .pipe(cdn())
})
