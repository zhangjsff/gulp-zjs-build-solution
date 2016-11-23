var gulp = require('gulp');
var global = require('../config')();
var rename = require('gulp-rename');
var os = require('os')
var filter = require('gulp-filter');
var sprity = require('sprity');
var glob = require("glob")

gulp.task('image:build', ['image:common','image:sprite','copy:other-to-dist'], function () {

	return gulp.src(global.devDir + '**/img/**/*.+' + global.imageTypes)
		.pipe(filter(global.filter)) 
		.pipe(rename(function (path) {

			if(os.type() == 'Windows_NT'){
				path.dirname = path.dirname.split('\\')[0] + '\\img\\' + path.dirname.replace(/.*\\img\\?/g,'')
			}else{
				path.dirname = path.dirname.split('/')[0] + '/img/' + path.dirname.replace(/.*\/img\/?/g,'')
			}
		})).
		pipe(gulp.dest(global.distDir))
});

gulp.task('image:sprite',function(){

});



gulp.task('image:common', function () {
	return gulp.src(global.devCommonDir + '**/*.+' + global.imageTypes).
		pipe(rename(function (path) {
			if(os.type() == 'Windows_NT'){
				path.dirname = 'common\\' + path.dirname
			}else{
				path.dirname = 'common/' + path.dirname
			}
		})).
		pipe(gulp.dest(global.distDir))
});


gulp.task('copy:other-to-dist',function(){
	return gulp.src(global.devDir + '**/static/other/**/*')
		.pipe(rename(function (path) {
			path.dirname = path.dirname.replace(/static/g,'')
		}))
		.pipe(gulp.dest(global.distDir))
});
