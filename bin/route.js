var myexpress = require("../index");

app = myexpress(); 
// Define a GET handler on /foo
app.get("/foo",function(req,res) {
  res.end("Got Foo");
});

// Define a POST handler on /foo
//app.post("/foo",function(req,res) {
//  res.end("Posted To Foo");
//});

app.listen(4000);
