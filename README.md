node-spider
=======

Generic web crawler powered by Node.js

# Installation
Using npm:

		$ npm install node-spider

# Usage
```js
var Spider = require('node-spider');

var spider = new Spider({
	// How many requests can be run in parallel
	concurrent: 5,
	// How long to wait after each request
	delay: 0,
	// A stream to where internal logs are sent, optional
	logs: process.stderr,
	// Re-visit visited URLs, false by default
	allowDuplicates: false,
	// If `true` all queued handlers will be try-catch'd, errors go to `error` callback
	catchErrors: true,
	// Called when there's an error, throw will be used if none is provided
	error: function(err, url) {
	},
	// Called when there are no more requests
	done: function() {
	},
	
	//- All options are passed to `request` module, for example:
	headers: { 'user-agent': 'node-spider' },
	encoding: 'utf8'
});

var handleRequest = function(doc) {
	// new page crawled
	console.log(doc.res); // response object
	console.log(doc.url); // page url
	// uses cheerio, check its docs for more info
	doc.$('a').each(function(i, elem) {
		// do stuff with element
		var href = elem.attr('href').split('#')[0];
		var url = doc.resolve(href);
		// crawl more
		spider.queue(url, handleRequest);
	});
};

// start crawling
spider.queue('http://google.com/', handleRequest);
```
