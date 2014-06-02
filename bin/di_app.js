var app, injector, loader;
express = require("..");
app = express();

var createInjector = require("../lib/injector");

app = express();

app.factory("foo",function(res,req,cb) {
  cb(null,"hello from foo DI!");
})

app.use(app.inject(function (res,foo) {
  res.end(foo);
}));

app.listen(4000);

