node-spider
=======

Generic web crawler powered by Node.js

# Installation
Using npm:

		$ npm install node-spider

To run the tests:

		$ grunt test

# Usage
```js
var Spider = require('node-spider');

var spider = new Spider({
	// How many requests can be running in parallel
	concurrent: 5,
	// How long to wait after each request
	delay: 0,
	// A stream to where internal logs are sent, optional
	logs: process.stderr,
	// Re-visit visited URLs, false by default
	allowDuplicates: false,
	// If `true` all queued handlers will be try-catch'd, errors go to `error` callback
	catchErrors: true,
	// Called when there's an error, throw will be unused if none is provided
	error: function(err, url){
	},
	// Called when there are no more requests
	done: function() {
	},
	
	//- All options are passed to `request` module, for example:
	headers: { 'user-agent': 'node-spider' },
	encoding: 'utf8'
});

var handleRequest = function(doc) {
	// request done
	console.log(doc.res); // request object
	console.log(doc.url); // url
	doc.$('a').each(function() { // cheerio
		// do stuff on element
		var href = this.attr('href').split('#')[0];
		var url = doc.resolve(href);
		// crawl
		spider.queue(url, handleRequest);
	});
};

// start crawling
spider.queue('http://google.com/', handleRequest);
```
