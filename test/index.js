'use strict';

var arli = require('../src/index.js');
var pkg = require('../package.json');
var semver = require('semver');

describe('ARLI', function() {
  before(function() {
    console.log(
      ' ---------------------------------------------------------\n'
    );
  });

  describe('arli', function() {
    it('should return an object', function() {
      arli.should.be.an.Object();
    });
  });

  describe('_VERSION', function() {
    it('should be a semantic version', function() {
      arli._VERSION.should.be.a.String();
      (semver.valid(arli._VERSION)).should.be.ok();
      (arli._VERSION === pkg.version).should.be.ok();
    });
  });

  describe('.transform(string, [options])', function() {
    it('should return a transformed string', function() {
      arli.transform().should.be.a.String();

      arli.transform('0123456789').should.be.equal('٠١٢٣٤٥٦٧٨٩');
      arli.transform('0123456789', {digit: false}).should.be.equal('0123456789');
    });
  });
});
