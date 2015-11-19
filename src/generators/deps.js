'use strict';

module.exports = function(options, extension, common, min) {
  options = options || {};
  options.name = (options.name || 'dependencies') + extension;

  return common.lazypipe()
    .pipe(function() {
      return common.gulp.if(!options.prod, common.gulp.sourcemaps.init());
    })
    .pipe(function() {
      return common.gulp.if(extension === '.css', common.gulp.cssBase64(options.base64 || {}));
    })
    .pipe(common.gulp.concat, options.name)
    .pipe(function() {
      return common.gulp.if(!options.prod, common.gulp.sourcemaps.write());
    })
    .pipe(function() {
      return common.gulp.if(options.prod, min());
    })
    .pipe(function() {
      return common.gulp.if(options.prod && options.extmin, common.gulp.rename({extname: '.min' + extension}));
    })();
};
