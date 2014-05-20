#!/usr/bin/env node

var express = require('myexpress');
console.log(express)

var app = express();
var http = require("http");
var server = http.createServer(app);
server.listen(4000)
