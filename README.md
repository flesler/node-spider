node-spider
=======

Generic web crawler powered by NodeJS

# Installation
Using npm:

    $ npm install node-spider

To run the tests:

    $ grunt test

# Usage
```js

spider = new Spider({
  concurrent: 5,
  logs: true,
  headers: { 'user-agent': 'node-spider' },
  error: function(url, err){
    // handle error
  },
  done: function() {
    // all requests are done
  }
);

var handleRequest = function(doc){
  // request done
  console.log(doc.res); // request object
  console.log(doc.url); // url
  doc.$('a').each(function(){ // cheerio
    // do stuff on element
    var href = this.attr('href');
    var url = doc.resolve(href).split('#')[0];
    if (condition) {
      // crawl
      spider.queue(url, handleRequest);
    }
  });
};

// start crawling
spider.queue('http://google.com/', handleRequest);
```
