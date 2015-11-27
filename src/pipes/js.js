'use strict';

var
  common = require('../common'),
  withName = require('vinyl-named'),
  withPath = require('vinyl-named-with-path'),
  webpack = require('webpack-stream')
  ;

var defaultWebpack = {
  dev: {
    devtool: '#cheap-module-eval-source-map',
  },
  prod: {}
};

module.exports.lint = function(options) {
  options = options || {};

  return require('../generators/lint')({
    common: common,
    linter: common.gulp.eslint,
    reporter: common.gulp.eslint.format,
    fail: options.fail,
    failer: common.gulp.eslint.failAfterError
  });
};

module.exports.compile = function(options) {
  options = options || {};

  var config = common.merge(
    true,
    options.prod ? defaultWebpack.prod : defaultWebpack.dev,
    options.pack
  );

  return common.lazypipe()
    .pipe(function() {
      return common.gulp.if(!options.retainPath, withName());
    })
    .pipe(function() {
      return common.gulp.if(options.retainPath, withPath());
    })
    .pipe(webpack, config)
    .pipe(function() {
      return common.gulp.if(options.prod, common.gulp.uglify());
    })
    .pipe(function() {
      return common.gulp.if(options.prod && options.extmin, common.gulp.rename({extname: '.min.js'}));
    })();
};

module.exports.deps = function(options) {
  return require('../generators/deps')(options, '.js', common, common.gulp.uglify);
};
