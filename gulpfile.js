var gulp = require('gulp');
var babel = require('gulp-babel');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('browserify', function() {
  var opts = {
    entries: './src/script.js',
    debug: true,
    // defining transforms here will avoid crashing your stream
    transform: [babelify]
  };

  var b = watchify(browserify(opts));


  b.on('update', function(){
    bundleBrowserify(b);
  });

  return bundleBrowserify(b);
});

gulp.task('babel', function() {
  return gulp.src('src/*.js')
    .pipe(watch('src/*.js'))
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});


function bundleBrowserify(b) {

  return b.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/'));
}
