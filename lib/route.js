makeRoute = function(verb, handler) {
  return function(req,res,next) {
    if (req.method == verb.toUpperCase()) {
      handler(req,res,next);
    } else {
      return next();
    }
  }
}

module.exports = makeRoute;


