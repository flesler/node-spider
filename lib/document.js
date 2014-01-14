var cheerio = require('cheerio'),
    url = require('url');

function Document(url, res) {
    this.res = res;
    this.url = url;
};

Document.prototype = {
    constructor: Document,
    
    // Lazy parse
    get $() {
        return this.$ = cheerio.load(this.res.body);
    },
    
    resolve: function(uri) {
        return url.resolve(this.url, uri);
    }
};

module.exports = Document;