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

      arli.transform('12/05/1989 12,05,1989 12.05.1989 12-05-1989 12-05-89').should.be.equal('١٢؍٠٥؍١٩٨٩ ١٢؍٠٥؍١٩٨٩ ١٢؍٠٥؍١٩٨٩ ١٢؍٠٥؍١٩٨٩ ١٢؍٠٥؍٨٩');
      arli.transform('05/12/1989 05,12,1989 05.12.1989 05-12-1989 05-12-89').should.be.equal('٠٥؍١٢؍١٩٨٩ ٠٥؍١٢؍١٩٨٩ ٠٥؍١٢؍١٩٨٩ ٠٥؍١٢؍١٩٨٩ ٠٥؍١٢؍٨٩');
      arli.transform('12/05,1989 05-12.1989').should.be.equal('١٢/٠٥,١٩٨٩ ٠٥-١٢.١٩٨٩');
      arli.transform('12/05/1989 05-12-1989', {digit: false}).should.be.equal('12/05/1989 05-12-1989');
      arli.transform('27/10/1985 10/27/1985 27-10-85', {dateFrom: 'DMY'}).should.be.equal('٢٧؍١٠؍١٩٨٥ ١٠/٢٧/١٩٨٥ ٢٧؍١٠؍٨٥');
      arli.transform('27/10/1985 10/27/1985 27-10-85', {dateFrom: 'MDY'}).should.be.equal('٢٧/١٠/١٩٨٥ ١٠؍٢٧؍١٩٨٥ ٢٧-١٠-٨٥');
      arli.transform('27/10/1985 10/27/1985 27-10-85', {dateTo: 'DMY'}).should.be.equal('٢٧؍١٠؍١٩٨٥ ٢٧؍١٠؍١٩٨٥ ٢٧؍١٠؍٨٥');
      arli.transform('27/10/1985 10/27/1985 27-10-85', {dateTo: 'MDY'}).should.be.equal('١٠؍٢٧؍١٩٨٥ ١٠؍٢٧؍١٩٨٥ ١٠؍٢٧؍٨٥');
    });
  });
});
