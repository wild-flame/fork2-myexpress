var express = require(".."), 
    request = require("supertest"),
    http = require("http"),
    expect = require("chai").expect;

describe("app",function() {

  var app = express();
  describe("create http server",function() {
    it("should create an http server", function(done){
      request(app)
      .get('/foo')
      .expect(404, done);
    }); 
  });

  describe("#listen", function() {
    var server;

    // This is synchronos test
    before(function(done) {
      server = app.listen(7000,done);
    });

    it("should return a http.Server", function(){
      expect(server).to.be.instanceof(http.Server);
    });

    it("should respond /foo with 404", function(done){
      request("http://localhost:7000")
      .get("/foo")
      .expect(404, done)
    });
  });
});


