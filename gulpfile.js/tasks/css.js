var config = require('../config');
var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var gulpif = require("gulp-if");
var replace = require('gulp-replace');
var replacer = require('../bin/replacer');
var gutil = require('gulp-util');
var autoprefixer = require('gulp-autoprefixer');
var global = config();
var tasksList = [];

global.projectList.forEach(function (projectName) {

	if(projectName[0] == '.') {return false;}
	if(global.moduleName && projectName != global.moduleName) {return false;}

	 gulp.task('css:' + projectName, function () {

		  return gulp.src(global.devDir  + projectName + '/**/*.scss')
			.pipe(sass({sourceComments: 'normal'}).on('error',gutil.log))
			.pipe(autoprefixer({
				browsers: ['> 1%'],
				cascade: false
			}))
			.pipe(gulpif('*.css',rename(function (path) {
				path.dirname = projectName +'/css'
			})))
			.pipe(replacer())
		  .pipe(gulp.dest(global.distDir))

	});

	tasksList.push('css:'+projectName);
});

gulp.task('css', tasksList, function (cb) {
     return gulp.src(global.devCommonDir + '/**/*.scss')
			.pipe(sass().on('error',gutil.log))
			.pipe(gulpif('*.css',rename(function (path) {
				path.dirname =  'common/css'
			})))
			.pipe(replacer())
			.pipe(gulp.dest(global.distDir))
});
