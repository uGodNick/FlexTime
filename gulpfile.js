const gulp = require('gulp');
const less = require('gulp-less');
const rename = require('gulp-rename');
const minifyCss = require('gulp-csso');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const minifyJs = require('gulp-uglify-es').default;
const webp = require('gulp-webp');

function style(done) {
  gulp.src('./source/less/style.less')
    .pipe(less({
      errorLogToConsole: true
    }))
    .on('error', console.error.bind(console))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulp.dest("./public/css"))
    .pipe(minifyCss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest("./public/css"))
    .pipe(browserSync.stream());
  done();
}

function minImages(done) {
  gulp.src('./source/img/**/*.{png, jpg, svg}')
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.mozjpeg({ progressive: true }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest('/public/img'));
  done()
}

function convertIntoWebp(done) {
  gulp.src('./source/img/**/*.{png, jpg, svg}')
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest('./public/img'));
  done()
}

function browserReload(done) {
  browserSync.reload();
  done();
}

function minJs(done) {
  gulp.src('./source/js/**/*.js')
    .pipe(minifyJs())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./public/js'));
  browserSync.reload();
  done()
}

function watchFiles(done) {
  gulp.watch('./source/less/**/*.less', style)
  gulp.watch('./source/js/**/*.js', minJs)
  done()
}

gulp.task('default', gulp.parallel(watchFiles, minImages, convertIntoWebp));
