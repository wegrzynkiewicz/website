var gulp = require('gulp');
var uncss = require('gulp-uncss');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');
var selectors = require('gulp-selectors');
var runSequence = require("run-sequence");
var inlinesource = require('gulp-inline-source');

var styles = [
    'node_modules/bootstrap/dist/css/bootstrap-grid.min.css',
    'src/styles/main.css'
];

gulp.task('build-scripts', function () {
});

gulp.task('build-styles', function () {
    return gulp.src(styles)
        .pipe(concat('all.css'))
        .pipe(uncss({
            html: ['src/index.html']
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('build'));
});

gulp.task('build-html', function () {
    return gulp.src('src/index.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('minify-selectors', function () {
    return gulp.src(['build/*.css', 'build/*.html', 'build/*.js'])
        .pipe(selectors.run({
            'css': ['css'],
            'html': ['html']
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('inject', function () {
    return gulp.src('build/index.html')
        .pipe(inlinesource({
            compress: false,
            rootpath: 'build'
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
    return gulp.src(['build/*', '!build/index.html'])
        .pipe(clean());
});

gulp.task('default', function () {
    runSequence(
        ['build-scripts', 'build-styles', 'build-html'],
        'minify-selectors',
        'inject',
        'clean'
    );
});