var gulp = require('gulp');
var browserify = require('browserify');
var debowerify = require('debowerify');
var source = require('vinyl-source-stream');
var stringify = require('stringify');
var bowerResolve = require('bower-resolve');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var $ = require('gulp-load-plugins')();
var paths = {
      source: 'app',
      destination: 'build',
      temp: '.tmp',
      scripts: ['static/modules/scripts/**/*.js'],
      main_script: './static/modules/scripts/app.js',
      scss: 'app/styles/main.scss'
    };
 
// Basic usage 
gulp.task('browserify', function() {
  bowerResolve.init(function () {
  var b = browserify(paths.main_script);
        b.require(bowerResolve('jquery'), { expose: 'jQuery' });
        b.transform('debowerify');
        b.transform(stringify(['.html']))
        .bundle().on('error', errorHandler)
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
          // do some other stuff like uglify whatever
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.temp + '/scripts'))
        //.pipe($.streamify($.uglify()))
        .pipe(gulp.dest(paths.destination + '/scripts'));
});
});

// Handle the error
function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
}