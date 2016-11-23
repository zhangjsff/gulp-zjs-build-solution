var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var global = require('../config')();
var BrowserSync = require('browser-sync').create();


gulp.task('build', function (callback) {
//		return gulpSequence('clean',['template','image:build'],'copy:dev',callback);
	  var BrowserSync = require('browser-sync').create();

		gulp.start('watch');

		if(global.ifBrowserSync){
			console.log(global.browserSyncConfig)
			BrowserSync.init(global.browserSyncConfig);
		}

		return gulpSequence('clean',['template','image:build','css'],'webpack','copy:dev','copy:dev',callback);

});

gulp.task('deploy', function (callback) {
		return gulpSequence('clean',['template','webpack','image:build','css'],'copy:online','cdn',callback);
});
gulp.task('deploy:css', function (callback) {
		return gulpSequence('clean','css','copy:online-css','cdn',callback);
});
gulp.task('deploy:js', function (callback) {
		return gulpSequence('clean','webpack','copy:online-js','cdn',callback);
});
gulp.task('deploy:image', function (callback) {
		return gulpSequence('clean','image:build','copy:online-other','cdn',callback);
});
gulp.task('deploy:template', function (callback) {
		return gulpSequence('clean','template','copy:online-html',callback);
});





//build js
gulp.task('build:js', function (callback) {
//		return gulpSequence('clean',['template','image:build'],'copy:dev',callback);
		return gulpSequence('clean:js','webpack','copy:dev',callback);
});

//build image
gulp.task('build:image', function (callback) {
//		return gulpSequence('clean',['template','image:build'],'copy:dev',callback);
		return gulpSequence('clean:image','image:build','copy:dev',callback);
});

//build css
gulp.task('build:css', function (callback) {
//		return gulpSequence('clean',['template','image:build'],'copy:dev',callback);
		return gulpSequence('clean:css', 'css','copy:dev','copy:dev',callback);
});

//build html
gulp.task('build:html', function (callback) {
//		return gulpSequence('clean',['template','image:build'],'copy:dev',callback);
		return gulpSequence('clean:html','template','copy:dev',callback);
});
