var mime = require("mime");
var accepts = require("accepts");
var crc32 = require('buffer-crc32');
var http = require("http");
var path = require('path');
var fs = require('fs');
var rparser = require("range-parser");

var proto = {};
proto.isExpress = true;

proto.redirect = function() {
  if (arguments.length === 1) {
    this.writeHead(302, {
      'Content-Length': 0,
      'Location':  arguments[0]});
  } else {
    this.writeHead(arguments[0], {
      'Content-Length': 0,
      'Location':  arguments[1]});
  }
  this.end();
}

proto.type = function(type) {
  this.setHeader("Content-Type", mime.lookup(type));
}

proto.default_type = function(type) {
  var contentType = this.getHeader('content-type');
  if (contentType === undefined)
    this.setHeader("Content-Type", mime.lookup(type));
}

proto.format = function(params) {
  var res = this;
  //console.log("params.keys :" + Object.keys(params));
  var keys = Object.keys(params);
  var req = res.req; 
  var accept = accepts(req);
  //console.log("accepts(req): " + accepts(req).toString());
  var result = accept.types(keys);
  if (keys.length === 0) {
    var err = new Error("Not Acceptable");
    err.statusCode = 406;
    throw err;
  }
  else {
    res.default_type(result);
    params[result]();
    return 
  }

} 

proto.send = function(code, data){
  var res = this;
  var req = res.req

  data = data || code;
  if (typeof code === 'number') {
    var statusCode = code;
    res.statusCode = statusCode;
    if (typeof data === 'number') {
      res.end(http.STATUS_CODES[code]);
      return;
    }
  }
  if (res.getHeader("Etag") === undefined && data && req.method === "GET") {
    res.setHeader("Etag","\""+crc32.unsigned(data)+"\"");
  }
  if (req.headers["if-none-match"] && req.headers["if-none-match"] === res.getHeader("Etag")) {
    res.statusCode = statusCode || 304;
  } else if(req.headers["if-modified-since"] && req.headers["if-modified-since"] >= res.getHeader('Last-Modified')) {
    res.statusCode = statusCode || 304;
  } else {
    res.statusCode = statusCode || 200;
  }
  if (typeof data === "string") {
    res.default_type("text/html");
    res.setHeader("Content-Length", Buffer.byteLength(data))
  } else if (data instanceof Buffer) {
    res.default_type("application/octet-stream");
    res.setHeader("Content-Length", data.length);
  } else { // data instance of Object
    res.default_type("json");
    data = JSON.stringify(data);
  }
  res.end(data);
};

proto.stream = function(stream) {
  var res = this;
  stream.on("data", function(data) {
     res.end(data);
  });
}

proto.sendfile = function(dataPath, options) {
  var res = this;
  var req = res.req;
  var range = req.headers["range"];
  var range_option = -2; //default


  //console.log("range: " + range);
  res.setHeader("Accept-Range","bytes");
  if (options) {
    options['root'] = options['root'] || ""
      dataPath = options['root'] + dataPath;
  }
  dataPath = path.normalize(dataPath);
  //console.log("dataPath: " + dataPath);
  
  fs.stat(dataPath, function(err,stat) {
    if (dataPath.indexOf("..") !== -1) {
      res.send(403); 
    } else if (err) {
      res.send(404, err);
    } else {
      if (range !== undefined) {
        var r = rparser(stat['size'],range);
        //console.log("r: " + r );
        if (r===-1) { // unsatisfiable range
          range_option = -1;
        } else if(r===-2) {
          range_option = -2;
        } else {
          range_option = {start:r[0].start, end:r[0].end} ;
        }
      }

      //console.log("range_option: " + range_option);

      if (stat.isDirectory()) {
        res.send(403); 
      } else if (range_option === -1){
        res.send(416); 
      } else if (range_option === -2){ 
        file = fs.createReadStream(dataPath);
        res.setHeader("Content-Length", stat['size']);
        res.type(path.extname(dataPath));
        res.stream(file);
      } else {
        file = fs.createReadStream(dataPath, range_option);
        res.statusCode = 206;
        res.setHeader("Content-Range", "bytes " + range_option.start + "-" + range_option.end + "/" + stat['size']);
        res.type(path.extname(dataPath));
        res.stream(file);
      }
    }
  });
};


module.exports = proto;

