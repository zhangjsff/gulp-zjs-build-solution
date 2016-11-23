var gulp = require('gulp');
var global = require('../config')();
var gulpIf = require('gulp-if');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var babel = require('gulp-babel');
var gutil = require('gulp-util');
// var cdn = require('../bin/fileCompare.js');

gulp.task('copy:dev',['copy:dev-html'],function () {

	return gulp.src([global.distDir +'**/*','!**/*.html'])
		// .pipe(cdn())
		.pipe(gulp.dest(global.devStaticDir));
});

gulp.task('copy:dev-html', function () {

	return gulp.src(global.distDir +'**/*.html')
		.pipe(gulp.dest(global.devViewDir));
});



gulp.task('copy:online', ['copy:online-html','copy:online-js','copy:online-css','copy:online-other'],function () {

});

gulp.task('copy:online-html', function () {

	return gulp.src(global.distDir +'**/*.html')
		.pipe(replace(/\/dev\//gi,'\/online\/'))
		.pipe(gulp.dest(global.onlineViewDir));
});

gulp.task('copy:dev-js', function(){
	return gulp.src([global.distDir +'**/*.js'])
		.pipe(gulp.dest(global.devStaticDir));
});

gulp.task('copy:online-js', function(){
	return gulp.src([global.distDir +'**/*.js'])
		.pipe(gulpIf('!**/libs/**/*',uglify({mangle:false}).on('error',gutil.log)))
		// .pipe(replace(/\/dev\//gi,'\/online\/'))
		.pipe(gulp.dest(global.onlineStaticDir));
});

gulp.task('copy:online-css', function(){
	return gulp.src([global.distDir +'**/*.css'])
		.pipe(csso())
		// .pipe(replace(/\/dev\//gi,'\/online\/'))
		.pipe(gulp.dest(global.onlineStaticDir));
});


gulp.task('copy:online-other', function(){
	return gulp.src([global.distDir +'**/*.+(jpeg|jpg|png|gif|svg|ttf|woff|woff2|eot|)'])
		.pipe(gulp.dest(global.onlineStaticDir));
});
