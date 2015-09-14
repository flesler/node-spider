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
# License

Copyright (c) 2014-2015, Ariel Flesler
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this
  list of conditions and the following disclaimer in the documentation and/or
  other materials provided with the distribution.

* Neither the name of the {organization} nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.