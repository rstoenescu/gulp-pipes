'use strict';

module.exports = function(options, common) {
  return options.common.lazypipe()
    .pipe(options.linter)
    .pipe(options.reporter)
    .pipe(function() {
      return !!options.fail ? options.failer('fail', {failOnWarning: true}) : common.noop();
    })();
};
