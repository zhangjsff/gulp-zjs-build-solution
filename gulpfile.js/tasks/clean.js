var gulp = require('gulp');
var gulpClean = require('gulp-clean');
var global = require('../config')();

gulp.task('clean', function () {
   return gulp.src('dist').
       pipe(gulpClean());
});

gulp.task('clean:css', function () {
   return gulp.src('dist/**/*.css').
       pipe(gulpClean());
});

gulp.task('clean:image', function () {
   return gulp.src('dist/**/*.+' + global.imageTypes).
       pipe(gulpClean());
});

gulp.task('clean:js', function () {
   return gulp.src('dist/**/*.js').
       pipe(gulpClean());
});

gulp.task('clean:html', function () {
   return gulp.src('dist/**/*.html').
       pipe(gulpClean());
});