let gulp = require('gulp');
let sass = require('gulp-sass');
let browserSync = require('browser-sync').create();
let concat = require('gulp-concat');
let uglify = require('gulp-uglifyjs');
let rename = require('gulp-rename');
let del = require('del');
let imagemin = require('gulp-imagemin');
let pngquant = require('imagemin-pngquant');
let cache = require('gulp-cache');
let cssnano = require('gulp-cssnano');
let autoprefixer = require('gulp-autoprefixer');
let htmlmin = require('gulp-htmlmin');


gulp.task('sass', function() {
    return gulp.src('./src/sass/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true
        }))
        .pipe(cssnano())
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.stream());
});

gulp.task('html', function() {
    return gulp.src('./src/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('css-lib', ['sass'], function() {
    return gulp.src([
            './src/css/slick.css',
            './src/css/slick-theme.css'
        ])
        .pipe(cssnano())
        .pipe(concat('libs.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./src/css'));
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: "./src"
    });
});

gulp.task('scripts', function() {
    return gulp.src([
            './src/js/slick.min.js'
        ])
        .pipe(uglify())
        .pipe(concat('libs.min.js'))
        .pipe(gulp.dest('./src/js'));
});

gulp.task('watch', ['browserSync', 'css-lib', 'scripts'], function() {
    gulp.watch('./src/sass/**/*.sass', ['sass']);
    gulp.watch("src/*.html").on('change', browserSync.reload);
    gulp.watch("./src/**/*.js").on('change', browserSync.reload);
});

gulp.task('clean', function() {
    return del.sync('dist')
});

gulp.task('img', function() {
    return gulp.src('./src/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('./dist/img'));

});

gulp.task('build', ['clean', 'html', 'sass', 'scripts'], function() {

    let buildCss = gulp.src([
            './src/css/main.css',
            './src/css/css-lib.min.css'
        ])
        .pipe(gulp.dest('./dist/css'));

    let buildFonts = gulp.src([
            './src/fonts/**/*'
        ])
        .pipe(gulp.dest('./dist/fonts'));

    let buildJs = gulp.src([
            './src/js/main.js',
            './src/js/libs.min.js'
        ])
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('clear', function() {
    return cache.clearAll();
});

gulp.task('default', ['watch']);
