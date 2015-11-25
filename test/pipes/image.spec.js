'use strict';

var
  del = require('del'),
  fs = require('fs'),
  gulp = require('gulp')
  ;

describe('Image', function() {

  var textFile = ' sdfsdfs sfsjfs fdfd';

  it('should not touch non-image files', function(done) {
    fileStream(textFile)
      .pipe(pipes.image.optimize())
      .pipe(assert.length(1))
      .pipe(assert.first(function(d) {
        expect(d.contents.toString()).to.equal(textFile);
      }))
      .pipe(assert.end(done));
  });

  it('should be able to optimize image', function(done) {
    var
      imageFilename = './test/fixtures/unoptimized.png',
      targetFolder = './test/fixtures/optimized',
      optimizedFilename = targetFolder + '/unoptimized.png',
      originalSize = fs.statSync(imageFilename).size
      ;

    gulp.src('./test/fixtures/unoptimized.png')
      .pipe(pipes.image.optimize())
      .pipe(assert.length(1))
      .pipe(gulp.dest(targetFolder))
      .pipe(assert.end(function() {
        var newSize = fs.statSync(optimizedFilename).size;

        expect(newSize).to.be.above(0);
        expect(newSize).to.be.below(originalSize);
        del.sync(targetFolder);

        done();
      }));
  });

});
