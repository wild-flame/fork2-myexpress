var http = require("http");
var Layer = require("./lib/layer.js");
var makeRoute = require("./lib/route.js");
var methods = require("methods").concat("all");
var createInjector = require("./lib/injector");

var myexpress = function() {
  var index=0;
  var currentHandle;
  var currentLayer;

  var app = function(request, response) {

    var callHandle = function(currentLayer, err) { 
      currentHandle = currentLayer.handle;
      var match_result = currentLayer.match(request.url);
      // Let response be able to get params
      request.ori_url = request.url; //Add ori_url to remember original request

      if (match_result) {
        request.params = match_result.params;
        if (currentLayer.ori_path != undefined) 
          // Do something with the request.url 
          request.url = currentLayer.ori_path;
      } else {
        request.params = {};
      }

      try{
        if (currentHandle.length < 4 && err == undefined && match_result) {
          currentHandle(request,response,next);
        } else if (currentHandle.length == 4 && err != undefined && match_result) {
          currentHandle(err,request,response,next);
        } else {
          next(err);
        }
      } catch(e) {
        console.error(e);
        next(e);
      }
    } //=============== END of FUNCTION `callHandle =================

    // The `next` function  
    var next = function(err){
      request.url = request.ori_url;
      index = index + 1;

      // Uncomment this for dubug
      //console.log("[CALL `next]");

      currentLayer = app.stack[index];
      if (currentLayer == undefined) {
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

      callHandle(currentLayer, err)
    }//=============== END of FUNCTION `next` ========================

    // Responde 404 if no middleware is added
    if (app.stack[0] == undefined) {
      response.statusCode = 404;
      response.end();
      return;
    }
    currentLayer = app.stack[0];
    callHandle(currentLayer);



  } 
  app.listen = function(port) {
    var server = http.createServer(app);
    server.listen(port);
    return server;
  }

  app.stack = [];

  app.use = function(){
    if (arguments.length == 1) {
      var path = "/";
      var handler = arguments[0];
      var options = {end:false};
    } else {
      var path = arguments[0];
      var handler = arguments[1];
      var options = arguments[2] || {end:false}
    }

    layer = new Layer(path, handler);

    if(typeof handler.handle === "function") {
      for(var i=0;  i< handler.stack.length; i++){
        handler.stack[i].ori_path = handler.stack[i].path; 
        handler.stack[i].path = layer.get_trim_path(path) + handler.stack[i].path; 
      }
      app.stack = app.stack.concat(handler.stack);
    } else {
      layer.match_options = options;
      app.stack.push(layer);
    }
  }

  app.handle = app; 

  app.route = function(path) {
    var route = makeRoute();
    app.use(path,route, {end:true});
    return route;
  }
  
  methods.forEach(function(method){
    app[method] = function(path, handler) {
      var route = makeRoute();
      app.use(path, route, {end:true});
      route[method](handler);
      return app;
    }
  });
 
  app._factories = {}
  app.factory = function(name,fn) {
    app._factories[name] = fn;
  }

  app.inject = function(handler) {
    injector = createInjector(handler, app);
    return injector;
  }

  return app;
}


module.exports = myexpress;


