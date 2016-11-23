var File = require('vinyl');
var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');
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
            var temp = content.match(/((src|href)=["']\.\.\/|url\(["']\.\.\/?|(require\(["'])?\.\.\/)([0-9a-zA-Z\.\/\-\?=\_\{\}\[\]\$]+)["']/g);
            if(temp){

                temp.forEach(function (item,index) {
                    var url = item.replace(/(src=|href=|url\()["']?|["']|\s/g,'');
                    urls[index] = {
                        oldUrl : url
                    };

                    if(url.indexOf('/static/') === 0 || url.indexOf('__') === 0 || url.indexOf('http') >= 0) { return }
                    if(url.indexOf('require') === 0 ) {return;}

                    urls[index].newUrl = path.join(file.path,url).replace(/\\/g,'/').replace(/template\/static\/|static\//g,'').replace(/.*fe\/src\/(view\/)?/g,global.staticDir);

                    if(path.basename(file.path).indexOf('.html') < 0){
                        urls[index].newUrl = urls[index].newUrl.replace(/\/[0-9a-zA-Z\_\-]+\/(css)\//g,'/')
                    }

                    // urls[index].newUrl  = path.dirname(urls[index].newUrl) + '/' + path.basename(urls[index].newUrl);

                    if(url.length > 0){

                        // console.log(path.basename(file.path)  + ' : replacement ----> ' + url + ' =====>' + urls[index].newUrl);
                        var replaceRep = new RegExp(escapeRegExp(url),'g')
                        if(global.operation && (global.operation.indexOf('deploy') >= 0)){
                          content = content.replace(replaceRep,global.cdnUrl + urls[index].newUrl.replace('/static/dev',''))
                        }else{
                          content = content.replace(replaceRep, urls[index].newUrl)
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


        this.push(file);
        return cb(null,file)
    })
}
