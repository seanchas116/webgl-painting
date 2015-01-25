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

gulp.task 'watch', ->
  args = xtend watchify.args,
    debug: true
  bundler = watchify browserify './src/index.coffee', args
  bundler.transform 'coffeeify'

  bundle = ->
    bundler.bundle()
      .pipe source('bundle.js')
      .pipe plumber
        errorHandler: notify.onError('Error: <%= error.message %>')
      .pipe buffer()
      .pipe sourcemaps.init(loadMaps: true)
      .pipe uglify()
      .pipe sourcemaps.write('./')
      .pipe notify("Build Finished")
      .pipe gulp.dest('./dist')

  bundle()
  bundler.on 'update', bundle

gulp.task 'default', ['watch']
