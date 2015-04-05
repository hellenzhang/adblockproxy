var http = require('http')
  , httpProxy = require('http-proxy')
  , fs = require("fs")

var proxyPort = 8123
  , httpPort = 9123;

httpProxy.createProxyServer({target:'http://localhost:' + httpPort}).listen(proxyPort);

var youku = fs.readFileSync("./youku.txt", "utf8")
  , youkuLen = youku.length;

http.createServer(function (req, res) {
	//console.log(req.url);
	//console.log(req.headers);
	var host = req.headers["host"];
	if(host.indexOf("sohu.com") != -1){
		res.write('<?xml version="1.0" encoding="UTF-8"?><VAST version="3.0"></VAST>');
		res.end();
		return;
	}
	if(host.indexOf("youku.com") != -1){
		res.write('{"P": 11,"RSALL": "","VAL": []}');
		res.end();
		return;
	}
	if(host.indexOf("qq.com") != -1){
		res.write('<?xml version="1.0" encoding="Utf-8"?><root decs="video-web"></root>');
		res.end();
		return;
	}
	if(req.url == "/proxy.pac"){
		var path = "." + req.url;
		var stat = fs.statSync(path);
		res.writeHead(200, {
			'Content-Type': 'text/javascript',
			'Content-Length': stat.size
		});
		fs.createReadStream(path).pipe(res);
		return;
	}
	if(req.url == "/youku.mp4"){
		var path = "." + req.url;
		var stat = fs.statSync(path);
		res.writeHead(200, {
			'Content-Type': 'video/mp4',
			'Content-Length': stat.size
		});
		fs.createReadStream(path).pipe(res);
		return;
	}
	var range = req.headers["range"]
	  , headers = {
		  'Content-Type': 'application/vnd.apple.mpegurl',
		  "Pragma": "no-cache",
		  "Expires": 0
		}
	  , content = "";

	if(range == "bytes=0-1"){
		headers['Accept-Ranges'] = 'bytes';
		headers['Content-Range'] = 'bytes 0-1/' + youkuLen;
		content = "#E";
	} else if(range){
		headers['Accept-Ranges'] = 'bytes';
		headers['Content-Range'] = 'bytes 0-'+(youkuLen-1)+'/' + youkuLen;
		content = youku;
	} else {
		content = youku;
	}
	res.writeHead(200, headers);
	res.write(content);
	res.end();
}).listen(httpPort);

