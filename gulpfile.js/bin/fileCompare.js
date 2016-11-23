var File = require('vinyl');
var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');
var os = require('os');
var fileHash = require('file-hash');
var global = require('../config')();
var co = require('co');
var OSS = require('ali-oss');

var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();

var db = new sqlite3.Database(global.dbCdn);
// Consts
const PLUGIN_NAME = 'gulp-file-compare';

var client = new OSS(global.cdnConfig);

const uploadStatic = function(path,filepath,hash,cb){
  co(function* () {
    client.useBucket('zt-static');
    var result = yield client.put(path, filepath);
    // console.log(result);
    if(result.res.status == 200){
      gutil.log('upload ' , gutil.colors.blue(path) , ' success')
      insertRow(path,hash);
      cb()
    }
  }).catch(function (err) {
    console.log(err);
    process.exit();
  });
}

const insertRow = function(path,hash){
  var stmt = db.prepare("INSERT INTO files VALUES (?,?)");
  stmt.run(path,hash);
}

const searchByPath = function(path,hash,upload,cb){

  db.all('SELECT path, hash from files  where path = \''+path+'\'',function(err,row){
    if(row.length < 1){
      upload(path,hash)
    }else if(!!row[0] && (row[0].hash != hash)){
      upload(path,hash)
    }else{
      gutil.log('compare ' , gutil.colors.grey(path) ,  gutil.colors.grey('same as cdn'))
      cb()
    }
  })
}


module.exports = function () {

    return through.obj(function(file, enc, cb) {


        if (file.isNull()) {
            // return empty file
            return cb(null, file);
        }

        if (file.isBuffer()) {
            var _this = this;
            var filepath = file.path.replace(/.*\/dist\/online\//ig,'');
            // console.log( file.path,filepath)
            fileHash(function (hash) {
               db.run("CREATE TABLE IF NOT EXISTS files (path TEXT, hash TEXT)");
               db.serialize(function() {
                 searchByPath(filepath,hash,function(path){
                  // console.log(filepath,file.path)
                  uploadStatic(filepath,file.path,hash,function(){
                    _this.push(file);
                    return cb(null,file)
                  });
                },
                function(){
                  _this.push(file);
                  return cb(null,file)
                }
              )
                //  insertRow(filepath,hash);
               });
            },
              //resolvable path
            file.path,
              //type of algorithm
           'sha1',
              //upper or not, lower is default
            true
            );
        }
        if (file.isStream()) {

            console.log('here is stream')
        }


    })
}
