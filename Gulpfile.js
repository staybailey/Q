'use strict';

var gulp = require('gulp');
var sync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var KarmaServer = require('karma').Server;
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');

// the paths to our app files
var paths = {
  // all our client app js files, not including 3rd party js files
  scripts: ['client/wwww/js/*.js'],
  html: ['client/template/*.html', 'client/index.html'],
  styles: ['client/styles/style.css'],
  // test: ['specs/**/*.js']
};

// any changes made to your
// client side code will automagically refresh your page
// with the new changes
gulp.task('start', ['serve'], function () {  
  sync({
    notify: true,
    // address for server,
    injectChanges: true,
    files: paths.scripts.concat(paths.html, paths.styles),
    proxy: 'localhost:3000'
  });
});

gulp.task('jshint', function() {  
  
  // gulp.src('client/wwww/js/*.js')
    // .pipe(jshint())    
    // .pipe(jshint.reporter('jshint-stylish'))
    // .pipe(jshint.reporter('fail'));
  return gulp.src('client/wwww/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))    
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Run our karma tests
// gulp.task('karma', function (done) {
//   new KarmaServer({
//     configFile: __dirname + '/karma.conf.js'
//   }, done).start();
// });

// start our node server using nodemon
gulp.task('serve', function () {
  nodemon({
    script: './server/server.js',
    ignore: 'node_modules/**/*.js'
  });
});

gulp.task('default', ['start']);