/**
 * Export modules to global scope as necessary
 * (only for testing)
 */

var chai = require('chai');

global.expect = chai.expect;
chai.use(require('chai-string'));

global.assert = require('stream-assert');
global.fileStream = require('./create-file-stream');
global.pipes = require('../src');
