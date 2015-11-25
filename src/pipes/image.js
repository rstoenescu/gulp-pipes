
'use strict';

var
  common = require('../common'),
  pngquant = require('imagemin-pngquant')
  ;

var defaultMinifier = {
  progressive: true,
  svgoPlugins: [{removeViewBox: false}],
  use: [pngquant()]
};

module.exports.optimize = function(options) {
  options = options || {};
  var minifierConfig = common.merge(true, defaultMinifier, options);

  return common.lazypipe()
    .pipe(common.gulp.imagemin, minifierConfig)();
};
