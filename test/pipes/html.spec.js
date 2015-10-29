'use strict';

describe('HTML', function() {

  var htmlFile    = '<!DOCTYPE html><html><head>  <title>Title</title>  \n <!-- This is a comment --> <body>   \n\nOne</body>\n\n </html>   ';
  var htmlFileTwo = '<html>  \n <body>   \n\n<p>Two  </p><!-- Another comment --></body>\n\n </html>   ';

  var expectedHtmlIncludeFile = '<!DOCTYPE html><html><body><h1>view</h1>\n<label>rstoenescu</label>\n</body></html>\n';

  it('should be able to lint valid HTML', function(done) {
    fileStream(htmlFile)
      .pipe(pipes.html.lint())
      .pipe(assert.length(1))
      .pipe(assert.first(function(d) {
        expect(d.contents.toString()).to.equal(htmlFile);
      }))
      .pipe(assert.end(done));
  });

  it('should throw error when linting invalid HTML', function(done) {
    fileStream(htmlFileTwo)
      .pipe(pipes.html.lint())
      .on('error', function(err) {
        expect(err.message).to.contain('Start tag seen without seeing a doctype first.');
        done();
      });
  });

  describe('compile', function() {

    it('should be able to dev-compile', function(done) {
      fileStream(htmlFile, htmlFileTwo)
        .pipe(pipes.html.compile())
        .pipe(assert.length(2))
        .pipe(assert.first(function(d) {
          expect(d.contents.toString()).to.equal(htmlFile);
        }))
        .pipe(assert.second(function(d) {
          expect(d.contents.toString()).to.equal(htmlFileTwo);
        }))
        .pipe(assert.end(done));
    });

    it('should be able to prod-compile', function(done) {
      fileStream(htmlFile, htmlFileTwo)
        .pipe(pipes.html.compile({
          prod: true
        }))
        .pipe(assert.length(2))
        .pipe(assert.first(function(d) {
          expect(d.contents.toString()).to.equal('<!DOCTYPE html><html><head><title>Title</title><body>One');
        }))
        .pipe(assert.second(function(d) {
          expect(d.contents.toString()).to.equal('<html><body><p>Two</p>');
        }))
        .pipe(assert.end(done));
    });

    it('should include other HTMLs', function(done) {
      require('gulp').src('./test/fixtures/main.html')
        .pipe(pipes.html.compile())
        .pipe(assert.length(1))
        .pipe(assert.first(function(d) {
          expect(d.contents.toString()).to.equal(expectedHtmlIncludeFile);
        }))
        .pipe(assert.end(done));
    });

  });

});
