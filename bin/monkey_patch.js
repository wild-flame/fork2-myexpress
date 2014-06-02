var express = require("../");
app = express();
app.use(function(req,res) {
  res.end(req.isExpress + "," + res.isExpress);
});

app.listen(4000);
