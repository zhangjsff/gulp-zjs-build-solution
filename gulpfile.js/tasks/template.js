var gulp = require('gulp');
var gutil = require('gulp-util');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var replacer = require('../bin/replacer');
var version = require('../bin/version');
var global = require('../config')();
var include = require("gulp-include-html");
var filter = require('gulp-filter');
var gulpif = require("gulp-if");
// var jadePhp = require('gulp-jade-for-php');
var jade = require('gulp-jade-php');
// var jade = require('gulp-jade');
gulp.task('template', function () {
	return gulp.src('src/view/**/*.+(html|jade)')
			.pipe(filter(global.filter))
			.pipe(gulpif('*.jade',jade({
				extension : ".html",
				filename : __dirname,
				pretty: true
			})).on('error', gutil.log))
			.pipe(include({
				ignore:/[\\|\/]\_.*\.html$/g
			}))
			.pipe(replacer())
			.pipe(version())
			.pipe(rename(function(path){
				path.dirname = path.dirname.replace(/\\/gi,'/   ').split('/')[0];
				path.dirname = path.dirname[0].toUpperCase() +  path.dirname.slice(1);
			}))
			.pipe(gulp.dest('dist/'));
});
