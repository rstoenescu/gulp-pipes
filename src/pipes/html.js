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

var defaultInclude = {
  prefix: '@@',
  basepath: '@file'
};

module.exports.lint = function() {
  return common.lazypipe()
    .pipe(common.gulp.html5Lint)();
};

module.exports.compile = function(options) {
  options = options || {};
  var minifierConfig = common.merge(true, defaultMinifier, options.min);
  var includeConfig = common.merge(true, defaultInclude, options.include);

  return common.lazypipe()
    .pipe(common.gulp.fileInclude, includeConfig)
    .pipe(function() {
      return common.gulp.if(
        options.prod,
        common.gulp.htmlmin(minifierConfig)
      );
    })();
};
