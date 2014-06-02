express = require("..")

app = new express();
subApp = new express();

function m2(req,res) {
  res.end("m2");
}

app.use(subApp);
app.use(m2);

app.listen(4000);

