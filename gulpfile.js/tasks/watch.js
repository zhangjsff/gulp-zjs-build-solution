var gulp = require('gulp');
var global = require('../config')();
var gulpSequence = require('gulp-sequence');
var path = require('path');


// watch image
gulp.task('watch',function () {

    gulp.watch([global.devDir + '/' + global.moduleName + '/**/*',global.devCommonDir + '**/*'], function (event) {

    		console.log('File Changed ===> filename is : ' + event.type, path.basename(event.path));

    		var filetype = path.extname(event.path)
    		filetype = filetype.substr(1,filetype.length);

                if(filetype == 'html' || filetype == 'jade'){
                    gulp.start('build:html');
                } else if(filetype.match(/(js|hbs|jsx)/)){
                    // gulp.start('build:js');
                } else if(filetype.match(/(scss)/)) {
                    gulp.start('build:css');
                } else if(filetype.match(new RegExp(global.imageTypes))) {
                    gulp.start('build:image');
                }
            })
})

gulp.task('watch:js',function(){
     gulp.watch([global.distDir + '**/*.js','!**/libs/*'], function (event) {
        console.log(event.path + ' -- ' + event.type);
        gulp.start('copy:dev-js');
    })
});
