var cheerio = require('cheerio'),
	url = require('url');

function Document(url, res) {
	this.url = url;
	this.res = res;
}

Document.prototype = {
	constructor: Document,
	
	// Lazy parse
	get $() {
		return this._$ || (this._$ = cheerio.load(this.res.body));
	},
	
	resolve: function(uri) {
		var base = this.$('base').attr('href');
		if (base && !uri.match(/^http/i)) uri = base + uri;
		
		return url.resolve(this.url, uri);
	}
};

module.exports = Document;
