'use strict';

module.exports = function(options, extension, common, min) {
  options = options || {};
  options.name = (options.name || 'dependencies') + (options.prod && options.extmin ? '.min' : '') + extension;
  var production = !!options.prod;

  return common.lazypipe()
    .pipe(function() {
      return production ? common.noop() : common.gulp.sourcemaps.init({loadMaps: true});
    })
    .pipe(common.gulp.concat, options.name)
    .pipe(function() {
      return production ? common.noop() : common.gulp.sourcemaps.write();
    })
    .pipe(function() {
      return production ? min(options.minify) : common.noop();
    })();
};
