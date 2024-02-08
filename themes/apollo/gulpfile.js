// var gulp = require('gulp');
// var sass = require('gulp-sass')(require('sass'));
// var autoprefixer = require('gulp-autoprefixer');
//
// function build(cb){
//     gulp.src('./source/scss/*.scss')
//         .pipe(sass({outputStyle: 'compressed'}))
//         // .pipe(sass({outputStyle: 'expanded'}))
//         .pipe(autoprefixer())
//         .pipe(gulp.dest('./source/css'));
//     cb();
// };
//
// exports.build = build;
// exports.default = function(){
//     gulp.watch('./source/scss/_partial/*.scss', build);
//     gulp.watch('./source/scss/*.scss', build);
// }
//

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

// 一次性编译 Sass 
gulp.task('sass', function() {
    return gulp.src('./source/scss/*.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./source/css'));
});

// 实时编译
gulp.task('default', ['sass'], function() {
    gulp.watch('./source/scss/_partial/*.scss', ['sass']);
    gulp.watch('./source/scss/*.scss', ['sass']);
});
