var Spider = require('../');

var spider = new Spider({
    logs: true,
    headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.2 Safari/537.36',
        'cookies': ''
    }
});

spider.queue('http://google.com', function(doc) {
    doc.$('a').each(function(){
        var url = this.attr('href');
        console.log('Found link:', doc.resolve(url));
    });
});