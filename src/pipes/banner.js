'use strict';

var
  common = require('../common'),
  path = require('path'),
  fs = require('fs')
  ;

module.exports = function(options) {
  options = options || {};
  options.variables = options.variables || {};

  if (!options.templatePath) {
    /*eslint-disable */
    options.templatePath = path.join(__dirname, '../assets/banner.tpl');
    /*eslint-enable */
  }
  else if (!fs.existsSync(options.templatePath)) {
    throw new Error('gulp-pipes: Template file does not exists at ' + options.templatePath);
  }

  var banner = fs.readFileSync(options.templatePath, 'utf8');

  if (!options.variables.pkg) {
    var root = common.getRoot();

    options.variables.pkg = require(path.join(root, 'package.json'));
  }

  if (!options.variables.year) {
    options.variables.year = new Date().getFullYear();
  }

  return common.lazypipe()
    .pipe(common.gulp.header, banner, options.variables)();
};
