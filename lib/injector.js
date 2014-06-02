// `getParamester` Originnally authored by Luin, modified to be used here
var getParameters = function (fn) {
  var fnText = fn.toString();

  var FN_ARGS        = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
      FN_ARG_SPLIT   = /,/,
      FN_ARG         = /^\s*(_?)(\S+?)\1\s*$/,
      STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

  var inject = [];
  var argDecl = fnText.replace(STRIP_COMMENTS, '').match(FN_ARGS);
  argDecl[1].split(FN_ARG_SPLIT).forEach(function(arg) {
    arg.replace(FN_ARG, function(all, underscore, name) {
      inject.push(name);
    });
  });

  return inject;
};

var createInjector = function(fn, app) {

  var names;
  var injector = function(req,res,next) {
    //console.log("fn: " + fn);
    //console.log("names: " + names);
    var values;
    try {
      injector.dependencies_loader(req,res,next)(function(err, values){
        if (err) {
          throw err
        } else {
          fn.apply(fn,values);
        }
      });
    } catch(e){
      next(e)
    };

  }

  injector.extract_params = function() {
    return getParameters(fn);
  }

  names = injector.extract_params();

  injector.dependencies_loader = function(req,res,next) {
    var results = [];
    var values = []; 
    var index = -1;
    var error;
    var BUILD_IN_ARG_NAMES = ['req','res','next'] 

    var f = app._factories;

    for(var i=0;i<3;i++){
      if(arguments[i]){
        //console.log(arguments[i]);
        f[BUILD_IN_ARG_NAMES[i]] = arguments[i];
      }
    }    
    //console.log("names: " + names);

    var next = function(err, fc_value) {
      if(err) {
        error = err;
        return;
      }
      if (fc_value) {
        values.push(fc_value);
      }
      index = index + 1;
      if (index >= names.length) {
        return;
      }

      //console.log("names[index]: " + names[index]);

      try {
        var func = app._factories[names[index]];
        if (func instanceof Function) {
          func(req,res,next);
        } else if (func) {
          next(null,func); 
        } else {
          throw new Error("Factory not defined: "+names[index]);
        }
      } catch(e) {
        error = e;
      }

    }

    loader = function(callback) {
      next();
      //if (error)
        //console.error(error);
      //console.log("values: " + values);
      callback(error,values);
    }

    return loader;
  }



  return injector;
}

module.exports = createInjector; 

