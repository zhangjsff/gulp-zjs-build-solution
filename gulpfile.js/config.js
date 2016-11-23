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

    /**
     * set the project name
     * @type {String}
     */
    result.projectName = 'home';


    /**
     * set if use cdn uploader
     * @type {Boolean}
     */
    result.cdnOpen = false;

    /**
     * set cdn file  sqlite  name
     * this file will record the file path and file hash to check if the file is changed or not
     * So the system will just upload the static file that changed
     * @type {String}
     */

    result.dbCdn = 'cdn.db';

    /**
     * the cdn domain name
     * @type {String}
     */
    result.cdnUrl = '/static/dev/'+result.projectName+'/' || 'http://cdn.yourdomainname.com';

    /**
     * the config for aliyun oss
     * @type {Object}
     */
    result.cdnConfig = {
      region: '[cdnRegion]',
      accessKeyId: '[accessKeyId]',
      accessKeySecret: '[accessKeySecret]'
    }

    /**
     * static Dir basename, the real path for static files in dev environment
     * @type {String}
     */
    result.staticDir = '/static/dev/'+result.projectName+'/';

    /**
     * relative dev static path
     * @type {String}
     */
    result.devStaticDir = '../../../static/dev/'+result.projectName+'/';

    /**
     * relative view files path
     * @type {String}
     */
    result.devViewDir = '../../Home/View/dev/';
    /**
     * tmp dir for online js, will be prepared to upload
     * @type {String}
     */
    if(result.cdnOpen){
      result.onlineStaticDir = 'dist/online/'+result.projectName+'/';
    }else{
      result.onlineStaticDir = '../../../static/online/'+result.projectName+'/';
    }

    /**
     * online view dir
     * @type {String}
     */
    result.onlineViewDir = '../../'+result.projectName+'/View/online/';

    /**
     * comment resource dir
     * @type {RegExp}
     */
    result.commonDir = result.staticDir + 'common/';

    /**
     * common resource dev dir
     * @type {String}
     */
    result.devCommonDir = 'src/common/';

    /**
     * resource dir
     * @type {String}
     */
    result.devDir = 'src/view/';


    /**
     * dist path
     * @type {String}
     */
    result.distDir = 'dist/';

    /**
     * set react native folder name
     * @type {Boolean}
     */
    result.reactNativeName = false;

    /**
     * set allowed images type
     * @type {String}
     */
    result.imageTypes = '(jpeg|jpg|png|gif|svg|PNG)';

    result.projectList = walk(result.devDir);
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

    //setSpecial js filter
    result.jsFilter = ['**/*'];



    /**
     * set filter to js, which will be webpacked
     */
    switch(argv.n){
      case 'User':
        result.jsFilter = ['**/main.js'];
        break;
      case 'App':
        result.jsFilter = ['**/main.js'];
        break;
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
      startPath: "/Apps/"+result.projectName+"/fe/dist/" + result.moduleName
		}



    function walk(base){

        var file = [];
        return fs.readdirSync(base);
    }


    return result;
};
