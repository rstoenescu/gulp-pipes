'use strict';

module.exports = function(options, extension, common, min) {
  options = options || {};
  options.name = (options.name || 'dependencies') + (options.prod && options.extmin ? '.min' : '') + extension;

  return common.lazypipe()
    .pipe(function() {
      return common.gulp.if(!options.prod, common.gulp.sourcemaps.init());
    })
    .pipe(common.gulp.concat, options.name)
    .pipe(function() {
      return common.gulp.if(!options.prod, common.gulp.sourcemaps.write());
    })
    .pipe(function() {
      return common.gulp.if(options.prod, min());
    })();
};
