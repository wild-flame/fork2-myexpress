var http = require("http");

var myexpress = function() {
  var app = function(request, response) {
    response.statusCode = 404;
    response.end();
  } 

  app.listen = function(port,callback) {
    var server = http.createServer(this,callback);
    server.listen(port,callback);
    return server;
  }

  return app;
}

module.exports = myexpress;
