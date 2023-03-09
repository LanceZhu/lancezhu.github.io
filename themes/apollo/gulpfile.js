var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
var autoprefixer = require('gulp-autoprefixer');

function build(cb){
    gulp.src('./source/scss/*.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        // .pipe(sass({outputStyle: 'expanded'}))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./source/css'));
    cb();
};

exports.build = build;
exports.default = function(){
    gulp.watch('./source/scss/_partial/*.scss', build);
    gulp.watch('./source/scss/*.scss', build);
}

