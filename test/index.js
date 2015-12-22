'use strict';

var arli = require('../dist/arli.js');
var pkg = require('../package.json');
var semver = require('semver');

describe('arli', function() {
  it('should be an object', function() {
    arli.should.be.an.Object();
  });
});

describe('arli version', function() {
  it('should be a semantic version', function() {
    arli._version.should.be.a.String();
    (semver.valid(arli._version)).should.be.ok();
    (arli._version === pkg.version).should.be.ok();
  });
});

describe('arli.transform(value, [options])', function() {
  it('should return a string', function() {
    arli.transform().should.be.a.String();
    arli.transform('').should.be.a.String();
    arli.transform([]).should.be.a.String();
    arli.transform({}).should.be.a.String();
    arli.transform(false).should.be.a.String();
    arli.transform(0).should.be.a.String();
    arli.transform(null).should.be.a.String();
    arli.transform(undefined).should.be.a.String();
  });

  it('should return not empty', function() {
    arli.transform('مرحبا').should.be.not.empty();
  });

  it('should return a global transformation', function() {
    //arli.transform(',;?()% ـــ ,;?()% ـــ ').should.be.equal('،؛؟﴾﴿٪ ـ ،؛؟﴾﴿٪ ـ ');
    arli.transform('صلى الله عليه و سلم صلى الله عليه و سلم').should.be.equal('ﷺ ﷺ');
  });

  it('should return a cleaned string', function() {
    arli.transform('   مرحبا   ').should.be.equal('مرحبا');
  });

  it('should return an Indian digits', function() {
    arli.transform('0123456789').should.be.equal('٠١٢٣٤٥٦٧٨٩');
  });

  it('should return an Indian digits with Arabic separators', function() {
    arli.transform('999,555,333.0000000').should.be.equal('٩٩٩٬٥٥٥٬٣٣٣٫٠٠٠٠٠٠٠');
    arli.transform('03.0000001').should.be.equal('٠٣٫٠٠٠٠٠٠١');
  });

  it('should return an Arabic date format', function() {
    arli.transform('27/05/1989 27-05-1989 27.05.1989').should.be.equal('٢٧؍٠٥؍١٩٨٩ ٢٧؍٠٥؍١٩٨٩ ٢٧؍٠٥؍١٩٨٩');
    arli.transform('05/27/1989 05-27-1989 05.27.1989').should.be.equal('٠٥؍٢٧؍١٩٨٩ ٠٥؍٢٧؍١٩٨٩ ٠٥؍٢٧؍١٩٨٩');
    arli.transform('05/27/1989 27-05-1989 05.27.1989', {dateFrom: 'DMY'}).should.be.equal('٠٥/٢٧/١٩٨٩ ٢٧؍٠٥؍١٩٨٩ ٠٥.٢٧.١٩٨٩');
    arli.transform('05/27/1989 27-05-1989 05.27.1989', {dateFrom: 'MDY'}).should.be.equal('٠٥؍٢٧؍١٩٨٩ ٢٧-٠٥-١٩٨٩ ٠٥؍٢٧؍١٩٨٩');
    arli.transform('05/27/1989 27-05-1989 05.27.1989', {dateTo: 'DMY'}).should.be.equal('٢٧؍٠٥؍١٩٨٩ ٢٧؍٠٥؍١٩٨٩ ٢٧؍٠٥؍١٩٨٩');
    arli.transform('05/27/1989 27-05-1989 05.27.1989', {dateTo: 'MDY'}).should.be.equal('٠٥؍٢٧؍١٩٨٩ ٠٥؍٢٧؍١٩٨٩ ٠٥؍٢٧؍١٩٨٩');
  });

  it('should return an Arabic punctuation', function() {
    arli.transform(',;?()%').should.be.equal('،؛؟﴾﴿٪');
    arli.transform(',;?()%', {excludePunc: ',()'}).should.be.equal(',؛؟()٪');
  });

  it('should return a removed Tatweel character', function() {
    arli.transform('مرحبـــــا').should.be.equal('مرحبـا');
    arli.transform('مرحبـــــا', {removeTatweel: 'all'}).should.be.equal('مرحبا');
  });

  it('should return an Arabic word ligatures', function() {
    arli.transform('صلى الله عليه و سلم رضي الله عنه').should.be.equal('ﷺ ؓ');
    arli.transform('صلى الله عليه و سلم رضي الله عنه', {excludeLigatures: ['رضي الله عنه']}).should.be.equal('ﷺ رضي الله عنه');
  });
});
