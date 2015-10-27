/**
 * Export modules to global scope as necessary
 * (only for testing)
 */

expect = require('chai').expect;
assert = require('stream-assert');
fileStream = require('./create-file-stream');

pipes = require('../src');
