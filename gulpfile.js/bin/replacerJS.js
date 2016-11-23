var File = require('vinyl');
var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');
var os = require('os');
var global = require('../config')();

// Consts
const PLUGIN_NAME = 'gulp-cng-replacer';

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

module.exports = function () {

    return through.obj(function(file, enc, cb) {


        if (file.isNull()) {
            // return empty file
            return cb(null, file);
        }
        if (file.isBuffer()) {
            var content = String(file.contents);
            // search all url
            var urls = {};
            var temp = content.match(/((src|href)=["']\.\.\/|url\(["']?\.\.\/|(require\(["'])?\.\.\/)([0-9a-zA-Z\.\/\-\?=\_\\]+)["']/g);
            if(temp){

                temp.forEach(function (item,index) {
                    var url = item.replace(/(src=|href=|url\()["']?|["']|\s/g,'');
                    if(url[url.length-1] == '\\'){url = url.substr(0,url.length - 1);}
                    var newUrl = '';

                    // console.log(url,file.path,__dirname.replace('gulpfile.js/bin',''))
                    file.path = file.path.replace(/\\/g,'/');
                    // url = url.replace(/\\/g,'/');
                    var dirname = __dirname.replace(/\\/g,'/');
                    newUrl = file.path.replace(/.*fe\//g,'');
                    newUrl = path.dirname(global.devDir + newUrl.replace('/js/','/static/js/'));
                    // console.log(path.join(newUrl,url) , url)
                    newUrl = path.join(newUrl,url).replace(/\\/g,'/').replace(/[/\/\\]static/,'').replace(/.*src[\/\\](view[\/\\])?/,global.staticDir);

                    if(url.length > 0){
                        // console.log(path.basename(file.path)  + ' : replacement ----> ' + url + ' =====>' + newUrl);
                        var replaceRep = new RegExp(escapeRegExp(url),'g')
                        if(global.operation && (global.operation.indexOf('deploy') >= 0)){
                          content = content.replace(replaceRep,global.cdnUrl + newUrl.replace('/static/dev',''))
                        }else{
                          content = content.replace(replaceRep,newUrl)
                        }
                    }
                });
            }

            file.contents = new Buffer(content);


            //file.contents = Buffer.concat([prefixText, file.contents]);
        }
        if (file.isStream()) {

            console.log('here is stream')
            //file.contents = file.contents.pipe(prefixStream(prefixText));
        }

        // function toLinuxUrl(url){

        //     if(os.type() == 'Windows_NT'){
        //         return  url = url.replace(/\\/g,'/');
        //     }
        //     return url
        // }


        this.push(file);
        return cb(null,file)
    })
}
