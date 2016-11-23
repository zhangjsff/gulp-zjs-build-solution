var File = require('vinyl');
var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');
var global = require('../config')();

// Consts
const PLUGIN_NAME = 'gulp-cng-version';

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
            var temp = content.match(/\[deploy_version\]/ig);
            if(temp){
              content = content.replace(/\[deploy_version\]/ig,global.version)
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
