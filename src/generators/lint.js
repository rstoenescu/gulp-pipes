'use strict';

module.exports = function(common, linter, reporter) {
  return common.lazypipe()
    .pipe(linter)
    .pipe(reporter)();
};
