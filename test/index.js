'use strict';

var should = require('should');
var arli = require('../src/index');

describe('arli', function() {
  describe('- transform(str, options)', function() {
    it('should return a string', function() {
      arli.transform().should.be.a.String();
      arli.transform('').should.be.a.String();
    });

    it('should return transformed string', function() {
      arli.transform('0123456789%(,;*)? 12/05/1989 12-05-1989 12.05.1989 12,05,1989 مرحبـــــا')
        .should.be.equal.to('٠١٢٣٤٥٦٧٨٩٪﴾،؛٭﴿؟ ١٢؍٠٥؍١٩٨٩ ١٢؍٠٥؍١٩٨٩ ١٢؍٠٥؍١٩٨٩ ١٢؍٠٥؍١٩٨٩ مرحبا');
      arli.transform('12/05/1989 12-05-1989 12.05.1989 12,05,1989', {date: 'none'})
        .should.be.equal.to('٠١٢٣٤٥٦٧٨٩٪﴾،؛٭﴿؟ ١٢/٠٥/١٩٨٩ ١٢-٠٥-١٩٨٩ ١٢.٠٥.١٩٨٩ ١٢,٠٥,١٩٨٩ مرحبا');
      arli.transform('12/05/1989 12-05-1989 12.05.1989 12,05,1989', {date: 'reverse'})
        .should.be.equal.to('٠١٢٣٤٥٦٧٨٩٪﴾،؛٭﴿؟ ٠٥؍١٢؍١٩٨٩ ٠٥؍١٢؍١٩٨٩ ٠٥؍١٢؍١٩٨٩ ٠٥؍١٢؍١٩٨٩ مرحبا');
      arli.transform('مرحبـــــا', {dash: 'extra'}).should.be.equal.to(false);
      arli.transform('0123456789%(,;*)? 12/05/1989 12-05-1989 12.05.1989 12,05,1989 مرحبـــــا',
        {number: false, char: false, date: 'none', dash: 'none'})
        .should.be.equal.to('0123456789%(,;*)? 12/05/1989 12-05-1989 12.05.1989 12,05,1989 مرحبـــــا');
    });
  });
});
