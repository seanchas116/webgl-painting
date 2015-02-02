'use strict'

gulp = require 'gulp'
gutil = require 'gutil'
plumber = require 'gulp-plumber'
notify = require 'gulp-notify'
uglify = require 'gulp-uglify'
source = require 'vinyl-source-stream'
buffer = require 'vinyl-buffer'
browserify = require 'browserify'
watchify = require 'watchify'
sourcemaps = require 'gulp-sourcemaps'
xtend = require 'xtend'
deploy = require 'gulp-gh-pages'
tslint = require 'gulp-tslint'

notifyError = ->
  plumber
    errorHandler: notify.onError('Error: <%= error.message %>')

gulp.task 'lint', ->
  gulp.src './src/**/*.ts'
    .pipe notifyError()
    .pipe tslint()
    .pipe tslint.report('verbose')
    .pipe notify('Lint Finished')

gulp.task 'watch-lint', ['lint'], ->
  gulp.watch './src/**/*.ts', ['lint']

gulp.task 'watch-bundle', ->
  args = xtend watchify.args,
    debug: true
  bundler = watchify browserify './src/index.ts', args
    .plugin 'tsify', noImplicitAny: true
    .transform 'debowerify'

  bundle = ->
    bundler.bundle()
      .on 'error', notify.onError('Error: <%= error.message %>')
      .pipe source('bundle.js')
      .pipe notify("Build Finished")
      .pipe gulp.dest('./dist')

  bundle()
  bundler.on 'update', bundle

gulp.task 'release-bundle', ->
  browserify './src/index.ts'
    .plugin 'tsify', noImplicitAny: true
    .transform 'debowerify'
    .bundle()
    .pipe source('bundle.js')
    .pipe buffer()
    .pipe sourcemaps.init(loadMaps: true)
    .pipe uglify()
    .pipe sourcemaps.write('./')
    .pipe notify("Build Finished")
    .pipe gulp.dest('./dist')

gulp.task 'deploy', ['release-bundle'], ->
  gulp.src './dist/**/*'
    .pipe deploy()

gulp.task 'default', ['watch-lint', 'watch-bundle']
