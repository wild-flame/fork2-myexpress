var p2re = require("path-to-regexp");

var Layer = function(layer_path, middleware) {
  this.handle = middleware;
  this.path = layer_path;
  this.match_options = {end:false}
  this.match = function(input_path) {
    var dc_path = decodeURIComponent(input_path); // decodeURI

    var names = []; 
    var re = p2re(this.get_trim_path(this.path),names, this.match_options);

    matched_item = re.exec(this.get_trim_path(dc_path));

    var get_params = function() {
      var p = {};//params
      for(var i=0; i < names.length; i++){
        p[names[i].name] = matched_item[i+1];
      }
      return p;
    }

    if (matched_item == null) {
      return undefined;
    } else {
      return { path: matched_item[0], params: get_params() };
    }
  }

  this.get_trim_path = function(dc_path) {
    if(dc_path.slice(-1) == '/')
      return dc_path.slice(0, -1);
    else 
      return dc_path
  };
};


module.exports = Layer; 

