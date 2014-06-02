var proto = {};
proto.isExpress = true;

proto.redirect = function() {
  if (arguments.length === 1) {
    this.writeHead(302, {
      'Content-Length': 0,
      'Location':  arguments[0]});
  } else {
    this.writeHead(arguments[0], {
      'Content-Length': 0,
      'Location':  arguments[1]});
  }
    this.end();
}

module.exports = proto;
