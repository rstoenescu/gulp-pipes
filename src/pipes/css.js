'use strict';

var
  common = require('../common'),
  nib = require('nib')
  ;

var defaultAutoPrefixer = {
  browsers: ['last 3 versions']
};

module.exports.lint = function() {
  return require('../generators/lint')(common, common.gulp.stylint, common.gulp.stylint.reporter);
};

module.exports.compile = function(options) {
  options = options || {};
  options.base64 = options.base64 || {};

  return common.lazypipe()
    .pipe(function() {
      return common.gulp.if(!options.prod, common.gulp.sourcemaps.init());
    })
    .pipe(common.gulp.stylus, {use: [nib()]})
    .pipe(common.gulp.cssBase64, options.base64)
    .pipe(function() {
      return common.gulp.if(options.prod, common.gulp.minifyCss());
    })
    .pipe(function() {
      return common.gulp.if(!options.prod, common.gulp.sourcemaps.write());
    }).pipe(function() {
      return common.gulp.if(options.prod && options.extmin, common.gulp.rename({extname: '.min.css'}));
    })();
};

module.exports.deps = function(options) {
  return require('../generators/deps')(options, '.css', common, common.gulp.minifyCss);
};
