var request = require('request'),
	Doc = require('./lib/Document');

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
			console.log('Spider:', status, url);
		}
	},

	full: function() {
		return this.active.length >= this.opts.concurrent;
	},

	queue: function(url, done) {
		if (this.visited[url]) return;

		if (!this.allowDuplicates) {
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

		request({
			url: url,
			headers: this.opts.headers,
			encoding: this.opts.encoding
		}, function(err, res, body) {
			if (err) {
				this.log('Error', url);
				if (!this.opts.error) throw err;
				return this.opts.error(err, url);
			}

			var doc = new Doc(url, res);
			this.log('Success', url);
			done.call(this, doc);
			this.finished(url);
		}.bind(this));
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
