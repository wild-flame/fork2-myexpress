var http = require("http");
var Layer = require("./lib/layer.js");
var makeRoute = require("./lib/route.js");
var methods = require("methods").concat("all");
var createInjector = require("./lib/injector");
var _request = require("./lib/request");
var _response = require("./lib/response");

var myexpress = function() {
  var index=0;
  var currentHandle;
  var currentLayer;

  var app = function(request, response, ori_next) {

    var callHandle = function(currentLayer, err) { 

      currentHandle = currentLayer.handle;
      var match_result = currentLayer.match(request.url);
      // Let response be able to get params

      if (match_result) {
        if (currentLayer.subapp === true) {
          request.ori_url = request.url; //Add ori_url to remember original request
          request.ori_app = request.app
          request.url = request.url.substr(match_result.path.length); 
          request.subapp = currentLayer.subapp;
        }
        request.params = match_result.params;
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
      index = index + 1;

      // Uncomment this for dubug
      //console.log("[CALL `next]");

      currentLayer = app.stack[index];
      if (currentLayer == undefined) {
        // ruturn 500 for unhandled error
        if (err) {
          if (request.subapp === true) {
            request.url = request.ori_url;
            request.subapp = false;
            request.app = request.ori_app
            ori_next(err);
            return;
          }
          response.statusCode = err.statusCode || 500;
          response.end("Internal Serve Error");
          return;
        } else {
          if (request.subapp === true) {
            request.url = request.ori_url;
            request.subapp = false;
            request.app = request.ori_app
            ori_next();
            return;
          }
          response.statusCode = 404;
          response.end("Page Not Found");
          return;
        }
      } 

      callHandle(currentLayer, err)
    }//=============== END of FUNCTION `next` ========================

    app.monkey_patch(request,response);

    // Responde 404 if no middleware is added
    if (app.stack[0] == undefined) {
      if (request.subapp === true) {
        request.url = request.ori_url;
        request.subapp = false;
        ori_next();
        return;
      }
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

    var layer = new Layer(path, handler);

    if(typeof handler.handle === "function") {
      layer.subapp = true;
      app.stack.push(layer);
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

  app.monkey_patch = function(req,res) {
    _request.__proto__ = req.constructor.prototype;
    _response.__proto__ = res.constructor.prototype;
    req.__proto__ = _request;
    res.__proto__ = _response;
    req.app = app;
    req.res = res;
    res.req = req;
  } 


  return app;
}


module.exports = myexpress;


