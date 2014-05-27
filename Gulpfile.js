var gulp = require('gulp');
var es6ModuleTranspiler = require('gulp-es6-module-transpiler');
var rename = require('gulp-rename');

var es = require('event-stream');

gulp.task('scripts', function() {
  return es.concat(
    gulp.src(['./ti-ember-sortable.js'])
      .pipe(es6ModuleTranspiler({type: 'amd', moduleName: 'ti-ember-sortable'}))
      .pipe(rename('ti-ember-sortable.amd.js')),
    gulp.src(['./ti-ember-sortable.js'])
      .pipe(es6ModuleTranspiler({type: 'cjs', moduleName: 'ti-ember-sortable'}))
      .pipe(rename('ti-ember-sortable.cjs.js')),
    gulp.src(['./ti-ember-sortable.js'])
      .pipe(es6ModuleTranspiler({type: 'globals'}))
      .pipe(rename('ti-ember-sortable.global.js'))
  ).pipe(gulp.dest('./dist'));
});

gulp.task('default', ['scripts']);
