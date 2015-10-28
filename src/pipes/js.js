'use strict';

var
  common = require('../common'),
  named = require('vinyl-named'),
  webpack = require('webpack-stream')
  ;

var defaultWebpack = {
  dev: {
    devtool: '#inline-source-map',
  },
  prod: {}
};

module.exports.lint = function() {
  return require('../generators/lint')(common, common.gulp.eslint, common.gulp.eslint.format);
};

module.exports.compile = function(options) {
  options = options || {};

  var config = common.merge(
    true,
    options.prod ? defaultWebpack.prod : defaultWebpack.dev,
    options.pack
  );

  return common.lazypipe()
    .pipe(named)
    .pipe(webpack, config)
    .pipe(function() {
      return common.gulp.if(options.prod, common.gulp.uglify());
    })();
};

module.exports.deps = function(options) {
  return require('../generators/deps')(options, '.js', common, common.gulp.uglify);
};
