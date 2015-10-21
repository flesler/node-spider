/*jshint -W030 */
var expect = require('chai').expect,
	Spider = require('../');

describe('Spider', function() {

	function create(opts) {
		return new Spider(opts);
	}

	// Empty _request() by default
	Spider.prototype._request = function() {};

	function mock(spider, fn) {
		// Override once
		spider._request = function(opts, done) {
			spider._request = function(){};
			fn(opts, done);
		};
	}

	describe('constructor()', function() {
		it('should have the default options', function() {
			var opts = create().opts;
			expect(opts.concurrent).to.equal(1);
			expect(opts.headers).to.deep.equal({});
		});

		it('should have the correct initial state', function() {
			var spider = create();
			expect(spider.pending).to.deep.equal([]);
			expect(spider.active).to.deep.equal([]);
			expect(spider.visited).to.deep.equal({});
		});

		describe('options.concurrent', function() {
			it('should not run more requests concurrent than allowed', function() {
				var spider = create({concurrent:2});
				expect(spider.full()).to.be.false;
				spider.queue('a');
				expect(spider.active.length).to.equal(1);
				expect(spider.full()).to.be.false;
				spider.queue('b');
				expect(spider.active.length).to.equal(2);
				expect(spider.full()).to.be.true;
				spider.queue('c');
				expect(spider.active.length).to.equal(2);
				expect(spider.pending.length).to.equal(1);
				expect(spider.full()).to.be.true;
			});
		});

		describe('options.allowDuplicates', function() {
			it('should not queue visited urls if false', function() {
				var spider = create({allowDuplicates:false});
				spider.queue('a');
				spider.queue('a');
				expect(spider.active.length).to.equal(1);
				expect(spider.pending.length).to.equal(0);
				expect(spider.visited.a).to.be.true;
			});

			it('should queue visited urls if true', function() {
				var spider = create({allowDuplicates:true});
				spider.queue('a');
				spider.queue('a');
				expect(spider.active.length).to.equal(1);
				expect(spider.pending.length).to.equal(1);
				expect(spider.visited.a).to.be.undefined;
			});
		});
	});

	// TO BE CONTINUED...
});