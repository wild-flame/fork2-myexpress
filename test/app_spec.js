var express = require("../"), 
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

describe("Implement app.use",function(){

  var app;

  var m1 = function() {};
  var m2 = function() {};

  before(function() {
    app = express();
  });

  it("should be able to add middlewares to stack", function() {
    app.use(m1);
    app.use(m2);
    expect(app.stack.length).to.eql(2);
  });
});

describe("Implement calling the middlewares", function() {
  var app;

  beforeEach(function() {
    app = express();
  });

  it("Should be able to call a single middleware", function(done){
    var m1 = function(request,response,next) {
      response.end("This is the middleware 1");
    };
    app.use(m1);
    request(app).get("/").expect("This is the middleware 1").end(done);
  });    

  it("Should be able to call `next` to go to the next middleware", function(done){
    var m1 = function(request,response,next) {
    next();
    };
    var m2 = function(request,response,next) {
      response.end("This is the middleware 2")
    };
    app.use(m1);
    app.use(m2);
    request(app).get("/").expect("This is the middleware 2", done);
  });

  it("Should 404 at the end of middleware chain", function(done){
    var m1 = function(request,response,next) {
      next();
    };
    var m2 = function(request,response,next) {
      next();
    };
    app.use(m1);
    app.use(m2);
    request(app).get("/").expect(404, done);
  });

  it("Should 404 if no middleware is added", function(done){
    request(app).get("/").expect(404, done);
  });
});

describe("Implement Error Handling", function() {
  var app

  beforeEach(function() { 
   app = express();
  });

  it("should return 500 for unhandled error", function(done) {
    var m1 = function(req,res,next) {
      next(new Error("boom!"));
    }
    app.use(m1);
    request(app).get("/").expect(500, done);
  });    

  it("should return 500 for uncaught error", function(done) {
    var m1 = function(req,res,next) {
      next();
    }
    var m2 = function(req,res,next) {
      throw new Error("boom!");
    }
    app.use(m1);
    app.use(m2);
    request(app).get("/").expect(500, done);
  });

  it("should skip error handlers when next is called without an error", function(done) {
    var m1 = function(req, res, next) {
      next();
    }
    var e1 = function(err,req,res,next) {
      //timeout
    }

    var m2 = function(req,res,next) {
      res.end("m2");
    }

    app.use(m1);
    app.use(e1);
    app.use(m2);
    request(app).get("/").expect("m2").end(done);
  });

  it("should skip normal middlewares if next is called with an error", function(done) {
    var m1 = function(req, res, next) {
      next(new Error("Boom!"));
    }
    var m2 = function(req ,res, next) {
      //timeout
    }
    var e1 = function(err,req,res,next) {
      res.end("e1")
    }
    app.use(m1);
    app.use(m2);
    app.use(e1);
    request(app).get("/").expect("e1").end(done);
  });
});

