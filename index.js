var request = require('request'),
	Doc = require('./lib/document');

function Spider(opts) {
	opts = this.opts = opts || {};
	opts.concurrent = opts.concurrent || 1;
	opts.headers = opts.headers || {};

	this.pending = [];
	this.active = [];
	this.visited = {};
}

Spider.prototype = {
	constructor: Spider,

	log: function(status, url) {
		if (this.opts.logs) {
			this.opts.logs.write('Spider: ' + status + ' ' + url + '\n');
		}
	},

	full: function() {
		return this.active.length >= this.opts.concurrent;
	},

	queue: function(url, done) {
		if (this.visited[url]) return;

		if (!this.opts.allowDuplicates) {
			this.visited[url] = true;
		}

		if (this.full()) {
			this.log('Queueing', url);
			this.pending.push(arguments);
		} else {
			this.load(url, done);
		}
	},

	load: function(url, done) {
		this.log('Loading', url);
		this.active.push(url);

		this.opts.url = url;
		this._request(this.opts, function(err, res, _) {
			if (err) {
				this.error(err, url);
				return this.finished(url);
			}

			var doc = new Doc(url, res);
			this.log('Success', url);
			if (this.opts.catchErrors) {
				try { done.call(this, doc); }
				catch (err) { this.error(err, url); }
			} else {
				done.call(this, doc);
			}
			this.finished(url);
		}.bind(this));
	},

	// Wrap it for easier mocking
	_request: function(opts, done) {
		// All options forwarded to request()
		request(opts, done);
	},

	error: function(err, url) {
		this.log('Error', url);
		if (!this.opts.error) throw err;
		this.opts.error(err, url);
	},

	dequeue: function() {
		var args = this.pending.shift();
		if (args) {
			this.load.apply(this, args);
		} else if (this.opts.done && this.active.length === 0) {
			this.opts.done.call(this);
		}
	},

	finished: function(url) {
		var i = this.active.indexOf(url);
		if (i === -1) {
			return this.log('URL was not active', url);
		}
		this.active.splice(i, 1);

		if (!this.full()) {
			if (this.opts.delay) {
				setTimeout(this.dequeue.bind(this), this.opts.delay);
			} else {
				this.dequeue();
			}
		}
	}
};

module.exports = Spider;
