var gulp = require('gulp');
var less = require('gulp-less');
var rename = require('gulp-rename');
var minifyCss = require('gulp-csso');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();
var minifyJs = require('gulp-uglify');

function server(done) {
    browserSync.init({
        server: {
            baseDir: './'
        },
        notify: false,
        port: 3000
    });
    done();
}

function style (done) {
    gulp.src('./less/style.less')
        .pipe(less({
            errorLogToConsole: true
        }))
        .on('error', console.error.bind(console))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(gulp.dest("./css"))
        .pipe(minifyCss())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest("./css"))
        .pipe(browserSync.stream());
    done();
}

function minImages(done) {
    gulp.src('./img/**/*.{png, jpg, svg}')
        .pipe(imagemin([
            imagemin.optipng({ optimizationLevel: 3 }),
            imagemin.mozjpeg({ progressive: true }),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest('./img'));
    done()
}

function convertIntoWebp(done) {
    gulp.src('./img/**/*.{png, jpg, svg}')
        .pipe(webp({ quality: 90 }))
        .pipe(gulp.dest('./img'));
    done()
}

function browserReload(done) {
    browserSync.reload();
    done();
}

function minJs(done) {
    gulp.src('./preJs/**/*.js')
        .pipe(minifyJs())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./js'));
    browserSync.reload();
    done()
}

function watchFiles(done) {
    gulp.watch('./**/*.html', browserReload)
    gulp.watch('./less/**/*.less', style)
    gulp.watch('./preJs/**/*.js', minJs)
    done()
}

gulp.task('default', gulp.parallel(server, watchFiles, minImages));