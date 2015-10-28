'use strict';

var
  common = require('../common'),
  nib = require('nib')
  ;

var defaultAutoPrefixer = {
  browsers: ['last 3 versions']
};

module.exports.lint = function() {
  return common.lazypipe()
    .pipe(common.gulp.stylint)
    .pipe(common.gulp.stylint.reporter)();
};

module.exports.compile = function(options) {
  options = options || {};

  var autoprefixerConfig = common.merge(
    true,
    defaultAutoPrefixer,
    options.autoprefixer
  );

  return common.lazypipe()
    .pipe(function() {
      return common.gulp.if(!options.prod, common.gulp.sourcemaps.init());
    })
    .pipe(common.gulp.stylus, {use: [nib()]})
    .pipe(common.gulp.autoprefixer, autoprefixerConfig)
    .pipe(function() {
      return common.gulp.if(options.prod, common.gulp.minifyCss());
    })
    .pipe(function() {
      return common.gulp.if(!options.prod, common.gulp.sourcemaps.write());
    })();
};

module.exports.deps = function(options) {
  options = options || {};
  options.name = (options.name || 'dependencies') + '.css';

  return common.lazypipe()
    .pipe(function() {
      return common.gulp.if(!options.prod, common.gulp.sourcemaps.init());
    })
    .pipe(common.gulp.concat, options.name)
    .pipe(function() {
      return common.gulp.if(!options.prod, common.gulp.sourcemaps.write());
    })
    .pipe(function() {
      return common.gulp.if(options.prod, common.gulp.minifyCss());
    })();
};