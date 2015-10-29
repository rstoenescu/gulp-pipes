'use strict';

var path = require('path');

describe('JS', function() {

  var jsFile    = 'var a = \'one\';';
  var jsFileTwo = 'var a = \'two\';';

  it('should be able to lint', function(done) {
    fileStream(jsFile, jsFileTwo)
      .pipe(pipes.js.lint())
      .pipe(assert.length(2))
      .pipe(assert.first(function(d) {
        expect(d.contents.toString()).to.equal(jsFile);
      }))
      .pipe(assert.second(function(d) {
        expect(d.contents.toString()).to.equal(jsFileTwo);
      }))
      .pipe(assert.end(done));
  });

  describe('compile', function() {

    it('should be able to dev-compile', function(done) {
      fileStream(jsFile, jsFileTwo)
        .pipe(pipes.js.compile())
        .pipe(assert.length(2))
        .pipe(assert.all(function(d) {
          var content = d.contents.toString();
          var base = path.basename(d.path);

          expect(content).to.contain('__webpack_require__');
          expect(content).to.contain('\n//# sourceMappingURL=data:application/json;base64,');
          expect(base).to.endWith('.js');
          expect(base).to.not.endWith('.min.js');
        }))
        .pipe(assert.end(done));
    });

    it('should be able to prod-compile', function(done) {
      fileStream(jsFile, jsFileTwo)
        .pipe(pipes.js.compile({
          prod: true
        }))
        .pipe(assert.length(2))
        .pipe(assert.all(function(d) {
          var content = d.contents.toString();
          var base = path.basename(d.path);

          expect(content).to.not.contain('__webpack_require__');
          expect(content).to.not.contain('\n//# sourceMappingURL=data:application/json;base64,');
          expect(content).to.contain('!function(r){function e(t){if(o[t])return o[t].exports;var n=o[t]={exports:{},id:t,loaded:!1};');
          expect(base).to.endWith('.js');
          expect(base).to.not.endWith('.min.js');
        }))
        .pipe(assert.end(done));
    });

    it('should be able to prod-compile and change extension to .min.js', function(done) {
      fileStream(jsFile, jsFileTwo)
        .pipe(pipes.js.compile({
          prod: true,
          extmin: true
        }))
        .pipe(assert.length(2))
        .pipe(assert.all(function(d) {
          var content = d.contents.toString();
          var base = path.basename(d.path);

          expect(content).to.not.contain('__webpack_require__');
          expect(content).to.not.contain('\n//# sourceMappingURL=data:application/json;base64,');
          expect(content).to.contain('!function(r){function e(t){if(o[t])return o[t].exports;var n=o[t]={exports:{},id:t,loaded:!1};');
          expect(base).to.endWith('.min.js');
        }))
        .pipe(assert.end(done));
    });

  });

  describe('deps', function() {

    it('should be able to dev-compile', function(done) {
      fileStream(jsFile, jsFileTwo)
        .pipe(pipes.js.deps())
        .pipe(assert.length(1))
        .pipe(assert.first(function(d) {
          var compiled = 'var a = \'one\';\nvar a = \'two\';\n//# sourceMappingURL=data:application/json;base6';

          expect(d.contents.toString().substr(0, compiled.length)).to.equal(compiled);
          expect(path.basename(d.path)).to.equal('dependencies.js');
        }))
        .pipe(assert.end(done));
    });

    it('should be able to prod-compile', function(done) {
      fileStream(jsFile, jsFileTwo)
        .pipe(pipes.js.deps({
          prod: true
        }))
        .pipe(assert.length(1))
        .pipe(assert.first(function(d) {
          var compiled = 'var a="one",a="two";';

          expect(d.contents.toString()).to.equal(compiled);
          expect(path.basename(d.path)).to.equal('dependencies.js');
        }))
        .pipe(assert.end(done));
    });

    it('should be able to prod-compile and change extension to .min.js', function(done) {
      fileStream(jsFile, jsFileTwo)
        .pipe(pipes.js.deps({
          prod: true,
          extmin: true
        }))
        .pipe(assert.length(1))
        .pipe(assert.first(function(d) {
          var compiled = 'var a="one",a="two";';
          var content = d.contents.toString();

          expect(d.contents.toString()).to.equal(compiled);
          expect(path.basename(d.path)).to.equal('dependencies.min.js');
        }))
        .pipe(assert.end(done));
    });

  });

});
