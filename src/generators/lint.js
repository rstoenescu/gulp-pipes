'use strict';

module.exports = function(options) {
  options.failerOptions = options.failerOptions || {};

  return options.common.lazypipe()
    .pipe(options.linter)
    .pipe(options.reporter)
    .pipe(function() {
      return options.common.gulp.if(options.fail, options.failer('fail', {failOnWarning: true}));
    })();
};
