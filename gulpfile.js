//
// import names
//

var gulp = require('gulp');
var gutil = require('gulp-util');

var del = require('del');

var connect = require('gulp-connect');

var postcss = require('gulp-postcss');
var prefixer = require('gulp-autoprefixer');
var pxtorem = require('postcss-pxtorem');

var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

var cssmin = require('gulp-clean-css');
var sass = require('gulp-sass');

var path = {
  style: {
    css: './src/style/scss/application.scss',
    images: './src/style/images/**/*.*'
  },
  images: './src/images/**/*.*',
  html: './src/*.html',
  js: './src/js/**/*.js',
  outDir: './dist/'
};

//
// helper functions
//

function imageBuild(src, dest){
  gulp.src(src)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()],
      interlaced: true
    }))
    .on('error', function (err) {
      gutil.log(err);
      this.emit('end');
    })
    .pipe(gulp.dest(dest))
    .pipe(connect.reload());
}

//
// clean
//

gulp.task('clean', function () {
  del(path.outDir);
});

//
// css build
//
 
gulp.task('css:build', function () {
  var processors = [
    pxtorem({
      propWhiteList: [],
      mediaQuery: true,
      replace: true
    })
  ];

  gulp.src(path.style.css)
    .pipe(sass())
    .pipe(prefixer())
    .pipe(postcss(processors))
    .pipe(cssmin())
    .on('error', function (err) {
      gutil.log(err);
      this.emit('end');
    })
    .pipe(gulp.dest(path.outDir + 'css/'))
    .pipe(connect.reload());
});


//
// image build
//

gulp.task('image:build', function () {
  imageBuild(path.images, path.outDir + 'images/');

  imageBuild(path.style.images, path.outDir + 'css/images/');
});

//
// html build
//

gulp.task('html:build', function () {
  gulp.src(path.html)
    //.pipe(rigger())
    .on('error', function (err) {
      gutil.log(err);
      this.emit('end');
    })
    .pipe(gulp.dest(path.outDir))
    .pipe(connect.reload());
});

//
// js build
//

gulp.task('js:build', function () {
  gulp.src(path.js)
    //.pipe(rigger())
    .on('error', function (err) {
      gutil.log(err);
      this.emit('end');
    })
    .pipe(gulp.dest(path.outDir + 'js/'))
    .pipe(connect.reload());
});

//
// server
//

gulp.task('webserver', function(){
  connect.server({
    root: [path.outDir],
    port: 8002,
    livereload: true
  });
});

//
// build
//

gulp.task('build', [
  'html:build',
  'css:build',
  'image:build',
  'js:build'
]);

//
// watch
//

gulp.task('watch', function() {
  gulp.watch('./src/style/scss/**/*.scss', ['css:build']);
  gulp.watch(path.images, ['image:build']);
  gulp.watch(path.style.images, ['image:build']);
  gulp.watch(path.html, ['html:build']);
});

//
// default
//
 
gulp.task('default', ['build', 'webserver', 'watch']);