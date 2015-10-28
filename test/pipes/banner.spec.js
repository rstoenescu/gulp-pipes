'use strict';

describe('Banner', function() {

  var file = 'FILE CONTENT';
  var path = require('path');
  var pkg = require(path.join(require('find-root')(), 'package.json'));

  it('should work without configuration', function(done) {
    fileStream(file)
      .pipe(pipes.banner())
      .pipe(assert.length(1))
      .pipe(assert.first(function(d) {
        var content = d.contents.toString();

        expect(content).to.contain(file);
        expect(content).to.contain('v' + pkg.version + '\n');
        expect(content).to.contain(' * (c) ');
        expect(content).to.contain(' ' + (pkg.author.name || pkg.author) + '\n');
      }))
      .pipe(assert.end(done));
  });

  it('should work WITH configuration but NO template path', function(done) {
    fileStream(file)
      .pipe(pipes.banner({
        variables: {
          pkg: {
            name: 'Package Name',
            author: 'Author Name',
            version: '5.5.5',
            license: 'RLIC',
            homepage: 'http://quasar-framework.org'
          },
          year: '1986'
        }
      }))
      .pipe(assert.length(1))
      .pipe(assert.first(function(d) {
        var content = d.contents.toString();

        expect(content).to.equal('/* Package Name v5.5.5\n * http://quasar-framework.org RLIC license\n * (c) 1986 Author Name\n */\n' + file);
      }))
      .pipe(assert.end(done));
  });

  it('should work WITH configuration AND template path', function(done) {
    fileStream(file)
      .pipe(pipes.banner({
        variables: {
          pkg: {
            name: 'Package Name',
            author: 'Author Name',
            version: '5.5.5',
            license: 'RLIC',
            homepage: 'http://quasar-framework.org'
          },
          year: '1986'
        },
        /*eslint-disable */
        templatePath: path.join(__dirname, '../../src/assets/banner.tpl')
        /*eslint-enable */
      }))
      .pipe(assert.length(1))
      .pipe(assert.first(function(d) {
        var content = d.contents.toString();

        expect(content).to.equal('/* Package Name v5.5.5\n * http://quasar-framework.org RLIC license\n * (c) 1986 Author Name\n */\n' + file);
      }))
      .pipe(assert.end(done));
  });

  it('should work without configuration but WITH template path', function(done) {
    fileStream(file)
      .pipe(pipes.banner({
        /*eslint-disable */
        templatePath: path.join(__dirname, '../../src/assets/banner.tpl')
        /*eslint-enable */
      }))
      .pipe(assert.length(1))
      .pipe(assert.first(function(d) {
        var content = d.contents.toString();

        expect(content).to.contain(file);
        expect(content).to.contain('v' + pkg.version + '\n');
        expect(content).to.contain(' * (c) ');
        expect(content).to.contain(' ' + (pkg.author.name || pkg.author) + '\n');
      }))
      .pipe(assert.end(done));
  });

  it('should throw error when template path does not exists', function() {
    expect(function() {
      fileStream(file)
        .pipe(pipes.banner({
          /*eslint-disable */
          templatePath: path.join(__dirname, 'bogus.tpl')
          /*eslint-enable */
        }));
    }).to.throw(/Template file does not exists at /);
  });

});
