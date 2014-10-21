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

