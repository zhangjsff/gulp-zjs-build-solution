var gulp = require('gulp');
var gulpIf = require('gulp-if');
var global = require('../config')();
var webpack = require('gulp-webpack');
var debug = require('gulp-debug');
var named = require('vinyl-named');
var os = require('os');
var filter = require('gulp-filter');
var replacer = require('../bin/replacerJS');
var path = require('path');

gulp.task('webpack', ['update:libs'],function() {

    var helperUrl = __dirname +  '/../../src/common/handlebars-helper';
    if(os.type() == 'Windows_NT') {
        helperUrl = helperUrl.replace(/\\gulpfile\.js\\tasks\/\.\.\/\.\./g,'').replace(/\//g,'\\');
    }

    return gulp.src('src/**/*.+(js|jsx)')
		.pipe(filter(global.filter))
    .pipe(filter(global.jsFilter))
		.pipe(named(function(file) {
			var extnameLength = path.extname(file.path).length;
			//console.log(file.ex)
			if(os.type() == 'Windows_NT') {
				if(file.path.indexOf('common\\') > 0){
					return file.path.slice(file.path.indexOf('common\\'),file.path.length-extnameLength).replace('static\\','');
				} else {
					return file.path.slice(file.path.indexOf('view\\') + 5,file.path.length-extnameLength).replace('static\\','');
				}

			} else {

				if(file.path.indexOf('common/') > 0){
					return file.path.slice(file.path.indexOf('common/'),file.path.length-extnameLength).replace('static/','');
				} else {
					return file.path.slice(file.path.indexOf('view/') + 5,file.path.length-extnameLength).replace('static/','');
				}
			}
		}))

		.pipe(gulpIf('!**/libs/*.+(js|jsx|vue)',webpack({
			watch: !(!!global.operation && (global.operation.indexOf('deploy') >= 0)),
			module: {
				loaders: [
          { test: /\.svg$/, loader: 'raw-loader' },
					{ test: /\.hbs/, loader: "handlebars-loader?helperDirs[]=" + helperUrl},
					{ test : /\.vue$/,loader : 'vue'},
					{ test: /\.(scss|sass)$/, loader: 'style-loader!css-loader!sass-loader'},
					{ test: /\.(less)$/, loader: 'style-loader!css-loader!less-loader'},
					{ test: /\.css$/, loader: 'style-loader!css-loader'},
					{ test: /(\.js|\.jsx)$/, loader: 'babel',query : {
							presets : [
                'react',
								'es2015',
                'stage-0',
							],
							"plugins": ["add-module-exports","syntax-decorators","transform-decorators",["component", [
								{ "libraryName": "mint-ui", "style": true }
							]]],
						}
					},

				]
			}
		})))
		.pipe(replacer())
		.pipe(gulp.dest('dist/'))
		.pipe(gulp.dest(global.devStaticDir));
});

gulp.task('update:libs',function(){
	return gulp.src(global.devCommonDir +'libs/*')
		.pipe(gulp.dest(global.distDir + 'common/libs'))
});
