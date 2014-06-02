express = require("..");

app = express();
subapp = express();

subapp.use("/bar",function(req,res) {
  res.end("embedded app: "+req.url);
});

app.use("/foo",subapp);

app.use("/foo",function(req,res) {
  res.end("handler: "+req.url);
});

app.listen(4000);
