'use strict';

var array = require('stream-array');
var PhonyFile = require('gulp-util').File;

module.exports = function() {
  var args = Array.prototype.slice.call(arguments);

  var i = 0;

  function create(contents) {
    return new PhonyFile({
      cwd: '/home/rstoenescu/',
      base: '/home/rstoenescu/test',
      path: '/home/rstoenescu/test/file' + (i++).toString() + '.js',
      contents: new Buffer(contents),
      stat: {mode: 438/*octal 666*/}
    });
  }

  return array(args.map(create));
};
