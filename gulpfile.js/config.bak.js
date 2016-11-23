/**
 * created by Jason , Gulp Config file
 * @returns {module}
 */

var fs = require('fs');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var filter = require('gulp-filter');
var gutil = require('gulp-util');

module.exports = function(){
    var result = {};

    result.staticDir = '/static/dev/home/';
    result.devStaticDir = '../../../static/dev/home/';
    result.devViewDir = '../../Home/View/dev/';
    result.onlineStaticDir = '../../../static/online/home/';
    result.onlineViewDir = '../../Home/View/online/';
    result.commonDir = result.staticDir + 'common/';
    result.devCommonDir = 'src/common/';
    result.devDir = 'src/view/';
    result.projectList = walk(result.devDir);
    result.distDir = 'dist/';
    result.reactNativeName = false;
    result.imageTypes = '(jpeg|jpg|png|gif|svg|PNG)';
    result.operation = argv._[0];

    if(result.projectList.indexOf(argv.n) < 0 && argv.n){
      gutil.log(gutil.colors.red('module name ' + argv.n + ' not Found, check your input name'));
      process.exit(1)
    }


    if(!argv.n && !argv.all && !argv.r){
      gutil.log(gutil.colors.red('You miss some params, use -n or --all to gulp your files'));
      process.exit(1)
    }

    if(argv.r){
        result.reactNativeName = argv.r
    }

    result.moduleName = argv.n ;
    if(argv.n){
        result.filter = ['**/' + argv.n + '/**/*'];
    }else{
        result.filter = ['**/*'];
    }

    //detect version when deploy
    result.version = argv.v ? argv.v : +new Date;
    result.version  = result.operation != 'deploy' ? 'dev' : result.version;

    //ignore React Native by Default
    result.filter.push('!**/RNApp/**/*');

    //接受是否开启browser-sync （-t
    result.ifBrowserSync = argv.t

    //browser-sync config
    result.browserSyncConfig = {
			server: {
            baseDir: "../../../",
						directory: true
      },
      startPath: "/Apps/Home/fe/dist/" + result.moduleName
		}

    function walk(base){

        var file = [];
        return fs.readdirSync(base);
    }


    return result;
};
