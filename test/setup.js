/**
 * Export modules to global scope as necessary
 * (only for testing)
 */

var chai = require('chai');

expect = chai.expect;
chai.use(require('chai-string'));

assert = require('stream-assert');
fileStream = require('./create-file-stream');

pipes = require('../src');
