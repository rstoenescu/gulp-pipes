
module.exports = {
  gulp: require('gulp-load-plugins')(),
  lazypipe: require('lazypipe'),
  merge: require('merge'),
  getRoot: require('find-root'),
  noop: require('through2').obj
};
