var http = require("http");
var Layer = require("./lib/layer.js")
var myexpress = function() {
  var index=0;
  var current_Middleware;

  //TODO:可以重构这部分的代码，重复代码有些多

  var app = function(request, response) {

      console.log("============================");

    // The `next` function call which the next middleware 
    var next = function(err){
      index = index + 1;

      // Uncomment this for dubug
      // console.log("[CALL `next]");

      current_Layer = app.stack[index];
      if (current_Layer == undefined) {
        // ruturn 500 for unhandled error
        if (err) {
          response.statusCode = 500;
          response.end("Internal Serve Error");
          return;
        } else {
          response.statusCode = 404;
          response.end("Page Not Found");
          return;
        }
      } 

      console.log("app.stack.handle is: " + app.stack[index].handle);
      console.log("request.url: " + request.url +"\t current_Layer.path :"+  current_Layer.path);

      current_Middleware = current_Layer.handle
        try{
          if (current_Middleware.length < 4 && err == undefined && current_Layer.match(request.url)) {
            current_Middleware(request,response,next);
          } else if (current_Middleware.length == 4 && err != undefined && current_Layer.match(request.url)) {
            current_Middleware(err,request,response,next);
          } else {
            next(err);
          }
        } catch(e) {
          next(e);
        }

    }

    // Responde 404 if no middleware is added
    if (app.stack[0] == undefined) {
      response.statusCode = 404;
      response.end();
      return;
    }

    // TODO:重构这段代码
    // return 500 for uncaught error
    try{
      current_Layer = app.stack[0]
        if (current_Layer.match(request.url)) {
          current_Layer.handle(request,response,next);
        } else {
          next();
        }
    } catch(e) {
      next(e);
    }
  } 

  app.listen = function(port,callback) {
    var server = http.createServer(this,callback);
    server.listen(port,callback);
    return server;
  }

  app.stack = [];

  app.use = function(){

    if (arguments.length == 1) {
      var path = "/";
      var middleware = arguments[0];
    } else {
      var path = arguments[0];
      var middleware = arguments[1];
    }

    layer = new Layer(path, middleware);
    if (middleware.stack != undefined) {
      app.stack = app.stack.concat(middleware.stack);
    } else {
      app.stack.push(layer);
    }
  }

  return app;
}

module.exports = myexpress;
