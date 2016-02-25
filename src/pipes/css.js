'use strict';

var
  common = require('../common'),
  nib = require('nib')
  ;

module.exports.lint = function(options) {
  options = options || {};

  return require('../generators/lint')({
    common: common,
    linter: common.gulp.stylint,
    reporter: common.gulp.stylint.reporter,
    fail: options.fail,
    failer: common.gulp.stylint.reporter
  }, common);
};

module.exports.compile = function(options) {
  options = options || {};
  options.base64 = options.base64 || {};
  var production = !!options.prod;

  return common.lazypipe()
    .pipe(function() {
      return production ? common.noop() : common.gulp.sourcemaps.init({loadMaps: true});
    })
    .pipe(common.gulp.stylus, {use: [nib()]})
    .pipe(common.gulp.cssBase64, options.base64)
    .pipe(function() {
      return production ? common.gulp.cssnano(options.minify) : common.noop();
    })
    .pipe(function() {
      return production ? common.noop() : common.gulp.sourcemaps.write();
    }).pipe(function() {
      return production && options.extmin ? common.gulp.rename({extname: '.min.css'}) : common.noop();
    })();
};

module.exports.deps = function(options) {
  return require('../generators/deps')(options, '.css', common, common.gulp.cssnano);
};
