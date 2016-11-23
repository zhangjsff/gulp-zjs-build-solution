var gulpCompass = require('gulp-compass');
var File = require('vinyl');
var through = require('through2');
var gutil = require('gulp-util');

module.exports = function (opt) {

    return gulpCompass(opt);

    return through.obj(function(file, enc, cb) {
        var img = opt.image + file.path.match(/dev\/view\/(.*)\/static\/sass\/.*/)[1] + '/static/img';
        console.log(img);
        var newOpt =  JSON.parse(JSON.stringify(opt));
        newOpt.image = img;
    //    var output = gulpCompass(newOpt);
    //    cb(null,file)
    })
}