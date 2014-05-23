var http = require("http");

var myexpress = function() {
  var index=0;
  var current_Middleware;

  //TODO:可以重构这部分的代码，重复代码有些多

  var app = function(request, response) {

    // The `next` function call which the next middleware 
    var next = function(err){
      index = index + 1;
      current_Middleware = app.stack[index];
      if (current_Middleware == undefined) {
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

      try{
        if (current_Middleware.length < 4 && err == undefined) {
          current_Middleware(request,response,next);
        } else if (current_Middleware.length == 4 && err != undefined) {
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

    // return 500 for uncaught error
    try{
      app.stack[0](request,response,next);
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

  app.use = function(func){
    if (func.stack != undefined) {
      app.stack = app.stack.concat(func.stack);
    } else {
      app.stack.push(func);
    }
  }

  return app;
}

module.exports = myexpress;
