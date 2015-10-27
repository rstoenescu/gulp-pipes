'use strict';

var common = require('../common');

var defaultMinifier = {
  removeComments: true,
  collapseWhitespace: true,
  collapseBooleanAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  removeOptionalTags: true,
  minifyJS: true,
  minifyCSS: true
};

module.exports.lint = function() {
  return common.lazypipe()
    .pipe(common.gulp.html5Lint)();
};

module.exports.compile = function(options) {
  options = options || {};
  var config = common.merge(true, defaultMinifier, options.min);

  return common.lazypipe()
    .pipe(function() {
      return common.gulp.if(
        options.prod,
        common.gulp.htmlmin(config)
      );
    })();
};
