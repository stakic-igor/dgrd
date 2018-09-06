'use strict';
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    clean = require('gulp-clean'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    runSequence = require('run-sequence'),
    uglify = require('gulp-uglify');

// Configure sass
gulp.task('sass', () => {
    return gulp.src('scss/**/*.scss')
    .pipe(sass({
        outputStyle: 'expanded'
    })
    .on('error', sass.logError))
    .pipe(gulp.dest('css'))
});

// Configure autoprefixer
gulp.task('autoprefixer', () => {
    gulp.src(['css/**/*.css'])
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('css/'))
});

// Configure clean task
gulp.task('clean:css', () => {
    gulp.src('dist/css/*.css')
    .pipe(clean())
});

// function keyword used bacuse plugin does not support arrow functions yet
gulp.task('clean:js', function () {
    gulp.src('dist/js/*')
    .pipe(clean())
});

// Configure css min
var cssMinifyLocation = ['css/*.css', '!css/*.min.css'];
gulp.task('css:min', () => {
    return gulp.src(cssMinifyLocation)
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(rename(
        { suffix: '.min' }
    ))
    .pipe(gulp.dest('dist/css'))
});

// Configure jsconcat and jsmin
gulp.task('compilejs', function() {
    gulp.src('js/**/*.js')
        //.pipe(concat('scripts.js'))
    .pipe(rename({
            suffix: '.min'
            }))
    .pipe(gulp.dest('dist/js/'));
});
gulp.task('compress:js', function() {
    gulp.src('js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
})
// Task to copy assets (images fonts and favicon) files
gulp.task('copy-assets', () => {
    gulp.src(
        [
            assetsPath + '/**',
        ],  {base: assetsPath}
    )
    .pipe(gulp.dest('web/'));
});

    // Configure watch
gulp.task('watch', () => {
    gulp.watch('scss/**/*.scss', () => {
        runSequence('clean:css', 'sass', 'autoprefixer')
    });
    gulp.watch('js/**/*.js', () => {
        runSequence('clean:js', 'compilejs')
    });
});

// Run build task
gulp.task('build', (callback) => {
    runSequence(
        'clean:css',
        'clean:js',
        'sass',
        'autoprefixer',
        'copy-assets',
        'compilejs',
        ['css:min'],
        callback
    );
});