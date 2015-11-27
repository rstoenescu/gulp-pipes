'use strict';

var
  path = require('path'),
  gulp = require('gulp')
  ;

describe('JS', function() {

  var jsFile    = 'var a = \'one\';';
  var jsFileTwo = 'var a = \'two\';';
  var jsFileSrc = './test/fixtures/one.js';
  var jsFileSrcTwo = './test/fixtures/two.js';

  describe('lint', function() {

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

    it('should not fail on error by default', function(done) {
      fileStream('var { a {')
        .pipe(pipes.js.lint())
        .on('error', function(err) {
          throw new Error('Should not fail on error');
        })
        .pipe(assert.end(done));
    });

    it('should be able to fail on error', function(done) {
      fileStream('var { a {')
        .pipe(pipes.js.lint({
          fail: true
        }))
        .on('error', function(err) {
          expect(err.message).to.contain('Failed with 1 error');
          done();
        });
    });

  });

  describe('compile', function() {

    it('should be able to dev-compile single entry', function(done) {
      gulp.src(jsFileSrc)
        .pipe(pipes.js.compile())
        .pipe(assert.length(1))
        .pipe(assert.first(function(d) {
          var content = d.contents.toString();
          var base = path.basename(d.path);

          expect(content).to.contain('__webpack_require__');
          expect(content).to.contain('//# sourceMappingURL=data:application/json;base64,');
          expect(base).to.endWith('.js');
          expect(base).to.not.endWith('.min.js');
        }))
        .pipe(assert.end(done));
    });

    it('should be able to dev-compile multiple entry points', function(done) {
      gulp.src([jsFileSrc, jsFileSrcTwo])
        .pipe(pipes.js.compile())
        .pipe(assert.length(2))
        .pipe(assert.all(function(d) {
          var content = d.contents.toString();
          var base = path.basename(d.path);

          expect(content).to.contain('__webpack_require__');
          expect(content).to.contain('//# sourceMappingURL=data:application/json;base64,');
          expect(base).to.endWith('.js');
          expect(base).to.not.endWith('.min.js');
        }))
        .pipe(assert.end(done));
    });

    it('should be able to prod-compile', function(done) {
      gulp.src([jsFileSrc, jsFileSrcTwo])
        .pipe(pipes.js.compile({
          prod: true,
          retainPath: true
        }))
        .pipe(assert.length(2))
        .pipe(assert.first(function(d) {
          var content = d.contents.toString();
          var base = path.basename(d.path);

          expect(content).to.not.contain('__webpack_require__');
          expect(content).to.not.contain('//# sourceMappingURL=data:application/json;base64,');
          expect(content).to.contain('!function(o){function e(r){if(n[r])return n[r].exports;var t=n[r]={exports:{},id:r,loaded:!1};');
          expect(base).to.endWith('.js');
          expect(base).to.not.endWith('.min.js');
        }))
        .pipe(assert.end(done));
    });

    it('should be able to prod-compile and change extension to .min.js', function(done) {
      gulp.src([jsFileSrc, jsFileSrcTwo])
        .pipe(pipes.js.compile({
          prod: true,
          extmin: true
        }))
        .pipe(assert.length(2))
        .pipe(assert.first(function(d) {
          var content = d.contents.toString();
          var base = path.basename(d.path);

          expect(content).to.not.contain('__webpack_require__');
          expect(content).to.not.contain('//# sourceMappingURL=data:application/json;base64,');
          expect(content).to.contain(' n="one",n="one",n="one",n="one",n="one",n="one",n="one",n="one",n="one",n="one",n="one",');
          expect(base).to.endWith('.min.js');
        }))
        .pipe(assert.end(done));
    });

    it('should pack assets required with webpack raw plugin', function(done) {
      /*
       * Wished we could use fileStream() but due to Webpack & Raw loader plugin
       * internals, we can't... we really need to read from an actual file on the filesystem.
       */
      gulp.src('./test/fixtures/raw-load.js')
        .pipe(pipes.js.compile())
        .pipe(assert.length(1))
        .pipe(assert.first(function(d) {
          expect(d.contents.toString()).to.contain('module.exports = \\"<h1>view</h1>\\\\n\\"');
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
