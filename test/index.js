'use strict';

);

describe('arli', function() {
  describe('- transform(str, options)', function() {
    it('should return a string', function() {
      arli.transform().sould.be.a.String();
      arli.transform('').sould.be.a.String();
    });

    it('should return transformed string', function() {
      arli.transform('0123456789%(,;*)? 12/05/1989 12-05-1989 12.05.1989 12,05,1989 مرحبـــــا')
        .sould.be.equal.to('٠١٢٣٤٥٦٧٨٩٪﴾،؛٭﴿؟ ١٢؍٠٥؍١٩٨٩ ١٢؍٠٥؍١٩٨٩ ١٢؍٠٥؍١٩٨٩ ١٢؍٠٥؍١٩٨٩ مرحبا');
      arli.transform('12/05/1989 12-05-1989 12.05.1989 12,05,1989', {date: 'none'})
        .sould.be.equal.to('٠١٢٣٤٥٦٧٨٩٪﴾،؛٭﴿؟ ١٢/٠٥/١٩٨٩ ١٢-٠٥-١٩٨٩ ١٢.٠٥.١٩٨٩ ١٢,٠٥,١٩٨٩ مرحبا');
      arli.transform('12/05/1989 12-05-1989 12.05.1989 12,05,1989', {date: 'reverse'})
        .sould.be.equal.to('٠١٢٣٤٥٦٧٨٩٪﴾،؛٭﴿؟ ٠٥؍١٢؍١٩٨٩ ٠٥؍١٢؍١٩٨٩ ٠٥؍١٢؍١٩٨٩ ٠٥؍١٢؍١٩٨٩ مرحبا');
      arli.transform('مرحبـــــا', {dash: 'extra'}).sould.be.equal.to(false);
      arli.transform('0123456789%(,;*)? 12/05/1989 12-05-1989 12.05.1989 12,05,1989 مرحبـــــا',
        {number: false, char: false, date: 'none', dash: 'none'})
        .sould.be.equal.to('0123456789%(,;*)? 12/05/1989 12-05-1989 12.05.1989 12,05,1989 مرحبـــــا');
    });
  });
});
