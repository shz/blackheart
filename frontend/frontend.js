var cache = {};

var serve = function(res, path) {

};

exports.handler = function(req, res) {
  // Build/sanitize
  var path = req.url.substr(0, '/frontend/'.length);
  path = path.replace(/\.\./g, '')
             .replace(/\/\//g, '/')
             .replace(/^\//, '')
             ;

  // Serve directly from cache if possible
  if (cache.hasOwnProperty(path)) {
    serve(res, path);

  // Build it up if needed
  } else {
    // TODO
  }

};
