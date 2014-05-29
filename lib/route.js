var methods = require("methods").concat("all");

makeRoute = function() {

  var route = function(request,response,ori_next) {

    var index = 0;

    runHandler = function(req,res,next) {
      var r = route.stack[index];
      if (r === undefined) {
        ori_next();
        return;
      } 
      if (r.verb.toUpperCase() === request.method || r.verb.toUpperCase() === "ALL") {
        r.handler(req,res,next);
      } else {
        next();
      }
    } 

    var next = function(err) {
      index = index + 1; 
      if (err === 'route') {
        ori_next(); 
      } else if (err instanceof Error) {
        ori_next(err);
      }
      runHandler(request,response,next); 
    }

    runHandler(request,response,next);
  }

  route.stack = [];

  route.use = function(verb,handler) {
    route.stack.push({verb: verb, handler: handler});
    return route;
  }

  methods.forEach(function(method){
    route[method] = function(handler) {
      route.stack.push({verb: method, handler: handler});
      return route;
    }
  });

  return route;
}

module.exports = makeRoute;


