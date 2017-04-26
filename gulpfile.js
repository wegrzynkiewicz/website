var gulp = require('gulp');
var uncss = require('gulp-uncss');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');
var runSequence = require("run-sequence");
var inlinesource = require('gulp-inline-source');

var externalStyles = [
    'node_modules/bootstrap/dist/css/bootstrap-grid.css'
];

gulp.task('build-scripts', function () {
});

gulp.task('build-styles', function () {
    return gulp.src(externalStyles)
        .pipe(concat('all.css'))
        .pipe(uncss({
            html: ['src/index.html']
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('build'));
});

gulp.task('build-html', function () {
    return gulp.src('src/index.html')
        .pipe(inlinesource({
            compress: false,
            rootpath: 'build'
        }))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
    return gulp.src(['build/*', '!build/index.html'])
        .pipe(clean());
});

gulp.task('default', function () {
    runSequence(
        ['build-scripts', 'build-styles'],
        'build-html',
        'clean'
    );
});