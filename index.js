var http = require("http");
var Layer = require("./lib/layer.js");
var makeRoute = require("./lib/route.js");
var methods = require("methods")
var myexpress = function() {
  var index=0;
  var current_Middleware;
  var current_Layer;

  //TODO:可以重构这部分的代码，重复代码有些多

  var app = function(request, response) {

    var callMiddleware = function(current_Layer, err) { 
      current_Middleware = current_Layer.handle;
      var match_result = current_Layer.match(request.url);
      // Let response be able to get params
      request.ori_url = request.url; //Add ori_url to remember original request

      if (match_result) {
        request.params = match_result.params;
        if (current_Layer.ori_path != undefined) 
          // Do something with the request.url 
          request.url = current_Layer.ori_path;
      } else {
        request.params = {};
      }

      try{
        if (current_Middleware.length < 4 && err == undefined && match_result) {
          current_Middleware(request,response,next);
        } else if (current_Middleware.length == 4 && err != undefined && match_result) {
          current_Middleware(err,request,response,next);
        } else {
          next(err);
        }
      } catch(e) {
        next(e);
      }
    } //=============== END of FUNCTION `callMiddleware =================

    // The `next` function  
    var next = function(err){
      request.url = request.ori_url;
      index = index + 1;

      // Uncomment this for dubug
      //console.log("[CALL `next]");

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
      callMiddleware(current_Layer, err)
    }

    // Responde 404 if no middleware is added
    if (app.stack[0] == undefined) {
      response.statusCode = 404;
      response.end();
      return;
    }
    current_Layer = app.stack[0];
    callMiddleware(current_Layer);
  } //=============== END of FUNCTION `next` ========================

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
      var options = {end:false};
    } else {
      var path = arguments[0];
      var middleware = arguments[1];
      var options = arguments[2] || {end:false}
    }

    layer = new Layer(path, middleware);

    if(typeof middleware.handle === "function") {
      for(var i=0;  i< middleware.stack.length; i++){
        middleware.stack[i].ori_path = middleware.stack[i].path; 
        middleware.stack[i].path = layer.get_trim_path(path) + middleware.stack[i].path; 
      }
      app.stack = app.stack.concat(middleware.stack);
    } else {
      layer.match_options = options;
      app.stack.push(layer);
    }
  }

  app.handle = app; 

  methods.forEach(function(method){
    app[method] = function(path, handler) {
      app.use(path, makeRoute(method, handler), {end: true});
    }
  });

  return app;
}


module.exports = myexpress;

