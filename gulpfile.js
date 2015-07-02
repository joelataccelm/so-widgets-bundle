var gulp = require('gulp');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var less = require('gulp-less');
var uglify = require('gulp-uglify');

var buildDir = 'build';

gulp.task('version', function(version) {
    var args = {};
    if(process.argv.length > 3) {
        var arr = process.argv.slice(3);
        for (var i = 0; i < arr.length; i++) {
            var argName = arr[i];
            if(argName.match(/-\w+/i)) {
                args[argName.slice(1)] = arr[i + 1];
            }
        }
    }
    if(typeof args.v == "undefined") {
        console.log("version task requires version number argument.");
        console.log("E.g. gulp release 1.2.3");
        return;
    }
    return gulp.src('src/so-widgets-bundle.php')
        .pipe(replace(/(Version: ).*/, '$1'+args.v))
        .pipe(replace(/(define\('SOW_BUNDLE_VERSION', ').*('\);)/, '$1'+args.v+'$2'))
        .pipe(replace(/(define\('SOW_BUNDLE_JS_SUFFIX', ').*('\);)/, '$1.min$2'))
        .pipe(gulp.dest(buildDir));
});

gulp.task('compileLess', function() {
    return gulp.src(['src/**/*.less', '!src/base/less/*.less', '!src/widgets/**'])
        .pipe(less({paths: ['src/base/less'], compress: true}))
        .pipe(gulp.dest(buildDir));
});

gulp.task('concatScripts', function () {

});

gulp.task('minifyScripts', function () {
    return gulp.src(['src/**/*.js'])
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest(buildDir));
});

gulp.task('compileJS', ['minifyScripts']);

gulp.task('copy', ['version', 'compileLess', 'compileJS'], function () {
    return gulp.src(['src/**/!(*.js|*.less)', '!src/so-widgets-bundle.php', 'src/**/widgets/**/styles/*.less', '!src/**/widgets/**/styles/*.css'])
        .pipe(gulp.dest(buildDir));
});

gulp.task('release', ['copy'], function(){

});
