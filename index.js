var request = require('request'),
    Document = require('./lib/document');

function Spider(opts) {
    opts = this.opts = opts || {};
    opts.concurrent = opts.concurrent || 1;
    opts.headers = opts.headers || {};

    this.pending = [];
    this.active = [];

    //this.crawled = {};
}

Spider.prototype = {
    constructor: Spider,

    log: function(status, url) {
        if (this.opts.logs) {
            console.log('>>>', status, url);
        }
    },

    full: function() {
        return this.active.length >= this.opts.concurrent;
    },

    queue: function(url, done) {
        if (this.full()) {
            this.log('Queueing', url);
            this.pending.push({u:url, d:done});
        } else {
            this.load(url, done);
        }
    },

    load: function(url, done) {
        this.log('Loading', url);
        this.active.push(url);

        request({
            url: url,
            headers: this.opts.headers
        }, function(err, res, body) {
            if (err) {
                this.log('Error', url);
                if (!this.opts.error) throw err;
                return this.opts.error(url, err);
            }
            if (res.headers['content-type'].search('text') == -1) {
                // do not attempt to parse a body with binary data
                this.log('Not parsing non-text content-type', url);
                delete res.body;
            }
            var doc = new Document(url, res);
            this.log('Success', url);
            done.call(this, doc);
            this.finished(url);
        }.bind(this));
    },

    dequeue: function() {
        var next = this.pending.shift();
        if (next) {
            this.load(next.u, next.d);
        } else if (this.opts.done) {
            this.opts.done.call(this);
        }
    },

    finished: function(url) {
        var i = this.active.indexOf(url);
        this.active.splice(i, 1);

        if (!this.full()) {
            this.dequeue();
        }
    }
};

module.exports = Spider;
