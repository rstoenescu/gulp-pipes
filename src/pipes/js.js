'use strict';

var
  common = require('../common'),
  withName = require('vinyl-named'),
  withPath = require('vinyl-named-with-path'),
  webpack = require('webpack-stream'),
  originalWebpack = require('webpack')
  ;

var defaultWebpack = {
  dev: {
    devtool: '#eval-inline-source-map'
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
  }, common);
};

module.exports.webpack = originalWebpack;

module.exports.compile = function(options) {
  options = options || {};

  if (options.define) {
    options.pack = options.pack || {};
    options.pack.plugins = options.pack.plugins || [];

    options.pack.plugins.push(
      new originalWebpack.DefinePlugin(options.define)
    );
  }

  var
    retainPath = !!options.retainPath,
    production = !!options.prod,
    config = common.merge(
      true,
      options.prod ? defaultWebpack.prod : defaultWebpack.dev,
      options.pack
    );

  return common.lazypipe()
    .pipe(function() {
      return retainPath ? common.noop() : withName();
    })
    .pipe(function() {
      return retainPath ? withPath() : common.noop();
    })
    .pipe(webpack, config)
    .pipe(function() {
      return production ? common.gulp.uglify(options.minify) : common.noop();
    })
    .pipe(function() {
      return production && !!options.extmin ? common.gulp.rename({extname: '.min.js'}) : common.noop();
    })();
};

module.exports.deps = function(options) {
  return require('../generators/deps')(options, '.js', common, common.gulp.uglify);
};
