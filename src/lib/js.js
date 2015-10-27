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
  return common.lazypipe()
    .pipe(common.gulp.eslint)
    .pipe(common.gulp.eslint.format)();
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
  options = options || {};
  options.name = (options.name || 'dependencies') + '.js';

  return common.lazypipe()
    .pipe(function() {
      return common.gulp.if(!options.prod, common.gulp.sourcemaps.init());
    })
    .pipe(common.gulp.concat, options.name)
    .pipe(function() {
      return common.gulp.if(!options.prod, common.gulp.sourcemaps.write());
    })
    .pipe(function() {
      return common.gulp.if(options.prod, common.gulp.uglify());
    })();
};
