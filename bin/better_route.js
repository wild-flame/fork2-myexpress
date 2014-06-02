var makeRoute = require("../lib/route");
var express = require("../");
var app = express();
var route = makeRoute();

app.use(route);

route.use("get",function(req,res,next) {
  next();
});

app.listen(4000);
