'use strict';

describe('CSS', function() {

  var precompFile    = 'body\n  background-color white';
  var precompFileTwo = 'body\n  background-color black';

  var cssFile = 'body {\n  background-color: white;\n\n } ';
  var cssFileTwo = 'body    {\n  background-color: black;\n }\n\n ';

  it('should be able to lint', function(done) {
    fileStream(precompFile, precompFileTwo)
      .pipe(pipes.css.lint())
      .pipe(assert.length(2))
      .pipe(assert.first(function(d) {
        expect(d.contents.toString()).to.equal(precompFile);
      }))
      .pipe(assert.second(function(d) {
        expect(d.contents.toString()).to.equal(precompFileTwo);
      }))
      .pipe(assert.end(done));
  });

  describe('compile', function() {

    it('should be able to dev-compile', function(done) {
      fileStream(precompFile)
        .pipe(pipes.css.compile())
        .pipe(assert.length(1))
        .pipe(assert.first(function(d) {
          var compiled = 'body {\n  background-color: #fff;\n}\n\n/*# sourceMappingURL=data:application/json;base64,';

          expect(d.contents.toString().substr(0, compiled.length)).to.equal(compiled);
        }))
        .pipe(assert.end(done));
    });

    it('should be able to prod-compile', function(done) {
      fileStream(precompFile)
        .pipe(pipes.css.compile({
          prod: true
        }))
        .pipe(assert.length(1))
        .pipe(assert.first(function(d) {
          expect(d.contents.toString()).to.equal('body{background-color:#fff}');
        }))
        .pipe(assert.end(done));
    });

  });

  describe('deps', function() {

    it('should be able to dev-compile', function(done) {
      fileStream(cssFile, cssFileTwo)
        .pipe(pipes.css.deps())
        .pipe(assert.length(1))
        .pipe(assert.first(function(d) {
          var compiled = 'body {\n  background-color: white;\n\n } \nbody    {\n  background-color: black;\n }\n\n \n/*# sourceMappingURL=data:application/json;base64,';

          expect(d.contents.toString().substr(0, compiled.length)).to.equal(compiled);
        }))
        .pipe(assert.end(done));
    });

    it('should be able to prod-compile', function(done) {
      fileStream(cssFile)
        .pipe(pipes.css.deps({
          prod: true
        }))
        .pipe(assert.length(1))
        .pipe(assert.first(function(d) {
          var compiled = 'body{background-color:#fff}';

          expect(d.contents.toString()).to.equal(compiled);
        }))
        .pipe(assert.end(done));
    });

  });

});
