/*jshint -W030 */
var expect = require('chai').expect,
	Doc = require('../lib/document');

describe('Document', function() {

	const URL = 'https://www.google.com/somepage/index.html';
	const HTML = '<html><head></head><body></body></html>';

	var doc;
	beforeEach(function() {
		doc = new Doc(URL, {body:HTML});
	});

	describe('constructor()', function() {
		it('should map the first argument to the url attribute', function() {
			expect(doc.url).to.equal(URL);
		});

		it('should map the first argument to the res attribute', function() {
			expect(doc.res.body).to.equal(HTML);
		});
	});

	describe('resolve()', function() {
		it('should resolve different variants of URLs and paths', function() {
			expect(doc.resolve('/otherpage.html')).to.equal('https://www.google.com/otherpage.html');
			expect(doc.resolve('otherpage.html')).to.equal('https://www.google.com/somepage/otherpage.html');
			expect(doc.resolve('./otherpage.html')).to.equal('https://www.google.com/somepage/otherpage.html');
			expect(doc.resolve('?key=value')).to.equal('https://www.google.com/somepage/index.html?key=value');
			expect(doc.resolve('//yahoo.com/page.html')).to.equal('https://yahoo.com/page.html');
		});
	});

	describe('get $()', function() {
		it('should not parse the body until it is called once', function() {
			expect(doc._$).to.be.undefined;
		});

		it('should cache the cheerio instance internally', function() {
			doc.$;
			expect(doc._$).to.be.a.function;
		});

		it('should not recreate the cheerio instance on every call', function() {
			expect(doc.$).to.equal(doc.$);
		});

		it('should parse the body correctly', function() {
			expect(doc.$('body').length).to.equal(1);
		});
	});
});