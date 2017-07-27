var gulp = require('gulp');
var uncss = require('gulp-uncss');
var concat = require('gulp-concat');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');
var selectors = require('gulp-selectors');
var runSequence = require("run-sequence");
var inlinesource = require('gulp-inline-source');

gulp.task('copy-resources', function () {
    return gulp.src("resources/**/*")
        .pipe(gulp.dest('dist'));
});

gulp.task('build-styles', function () {
    return gulp.src("src/**/*.css")
        .pipe(concat('styles.css'))
        .pipe(uncss({
            html: ['src/index.html']
        }))
        .pipe(cleanCSS({
            level: {
                1: {
                    specialComments: 'none'
                }
            }
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('build-html', function () {
    return gulp.src('src/index.html')
        .pipe(htmlmin({
            minifyJS: true,
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('minify-selectors', function () {
    var processors = {
        css: ['css'],
        html: ['html']
    };
    var ignores = {
        ids: '*'
    };
    return gulp.src(['build/**/*.css', 'build/*.html', 'build/*.js'])
        .pipe(selectors.run(processors, ignores))
        .pipe(gulp.dest('build'));
});

gulp.task('inject', function () {
    return gulp.src('build/index.html')
        .pipe(inlinesource({
            compress: false,
            rootpath: 'build'
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', function () {
    runSequence(
        ['copy-resources', 'build-styles', 'build-html'],
        'minify-selectors',
        'inject'
    );
});