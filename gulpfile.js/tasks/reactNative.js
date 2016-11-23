var gulp = require('gulp');
var shell = require('gulp-shell');
var gutil = require('gulp-util');
var insert = require('gulp-insert');
var fs = require('fs');
var path = require('path');
var global = require('../config')();

// console.log(typeof global.reactNativeName.toString() == 'string')



gulp.task('RN:start',function(){
	checkAvalible()
	gulp.src('src/RNApp/' + global.reactNativeName + '/' + global.reactNativeName + '.ios.js')
		.pipe(shell([
			'(cd src/RNApp/' + global.reactNativeName + '; react-native start)'
			]))
});

gulp.task('RN:bundle',['bundle:dev'],function(){
	checkAvalible()
	var version = setNewVersion();
	gulp.src('src/RNApp/' + global.reactNativeName + '/dist/*')
		.pipe(insert.prepend('/** @' + version + '@ **/ \n'))
		.pipe(gulp.dest(global.devStaticDir + 'react-native'))
})


gulp.task('RN:deploy',['bundle:deploy'],function(){
	checkAvalible()
	var version = setNewVersion();
	gulp.src('src/RNApp/' + global.reactNativeName + '/dist/*')
		.pipe(insert.prepend('/** @' + version + '@ **/ \n'))
		.pipe(gulp.dest(global.onlineStaticDir + 'react-native'))
})

gulp.task('bundle:dev',function(){
	checkAvalible()
	return gulp.src('src/RNApp/' + global.reactNativeName + '/' + global.reactNativeName + '.ios.js')
					.pipe(shell([	
						'(cd src/RNApp/' + global.reactNativeName + '; react-native bundle --platform ios --entry-file ' + global.reactNativeName +'.ios.js --bundle-output dist/' + global.reactNativeName + '.ios.bundle)',
						'(cd src/RNApp/' + global.reactNativeName + '; react-native bundle  --platform android --entry-file  ' + global.reactNativeName + '.android.js --bundle-output dist/' + global.reactNativeName + '.android.bundle)',
						]))
});


gulp.task('bundle:deploy',function(){
	checkAvalible()
	return gulp.src('src/RNApp/' + global.reactNativeName + '/' + global.reactNativeName + '.ios.js')
					.pipe(shell([	
						'(cd src/RNApp/' + global.reactNativeName + '; react-native bundle --platform ios --entry-file ' + global.reactNativeName +'.ios.js --bundle-output dist/' + global.reactNativeName + '.ios.bundle --dev false)',
						'(cd src/RNApp/' + global.reactNativeName + '; react-native bundle  --platform android --entry-file  ' + global.reactNativeName + '.android.js --bundle-output dist/' + global.reactNativeName + '.android.bundle --dev false)',
						]))
});

function checkAvalible(){

	if(!global.reactNativeName || typeof global.reactNativeName != 'string'){ 
		gutil.log(gutil.colors.red('Please use -r to set your react native folder name,folder name is required'));
		process.exit(1);
	}
}

function setNewVersion(){

	var versionFilePath = global.devDir + '../RNApp/' + global.reactNativeName + '/version.txt';

	var oldVersion = parseInt(fs.readFileSync(versionFilePath,'utf8'));
	var newVersion = false;
	if(oldVersion.length === 0){
		newVersion = 1;
	} else if(isNaN(oldVersion)){
		gutil.log(gutil.colors.red('Your version.txt file content must be number'));
		process.exit(1);
	} else {
		newVersion = oldVersion + 1
	}

	if(newVersion){
		fs.writeFileSync(versionFilePath, newVersion, 'utf8')
	} else {
		gutil.log(gutil.colors.red('Version update failed, contact Jiansong or check your version file'));
		process.exit(1);
	}

	return newVersion;
}