var fs = require('fs')
  , fsPath = require('path')
  , jade = require('jade')
  , stylus = require('stylus')
  , config = require('../config')
  ;

var cache = {};

var getExtension = function(path) {
  return (path.match(/\.(\w*)$/) || [])[1] || '';
};

var getFile = function(path) {
  return (path.match(/([^\/]+)(?:\.\w*)$/) || [])[1] || 'undefined';
};

var convertContent = function(path, content) {
  var ext = getExtension(path);

  switch (ext) {
    case 'jade':
      content = new Buffer('bh.templates["' + getFile(path) + '"] = ' + jade.compile(content.toString(), {
        filename: path,
        compileDebug: config.debug,
        client: true
      }));
      break;

    case 'styl':
      stylus.render(content.toString(), {
        filename: path,
        paths: [] // TODO - extra import paths?
      }, function(err, css) {
        if (err)
          throw err;
        content = new Buffer(css);
      });
      break;
  }

  return content;
};

var serve = function(res, path) {
  var ext = getExtension(path);
  var contentType = 'application/octet-steam';
  switch (ext) {
    case 'png':
      contentType = 'image/png';
      break;
    case 'styl':
      contentType = 'text/css; charset=utf-8';
      break;
    case 'js':
      contentType = 'application/javascript; charset=utf-8';
      break;
    case 'jade':
      contentType = 'application/javascript; charset=utf-8';
      break;
  }

  var content = cache[path];
  console.log('STATIC', path, contentType);
  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': content.length
  });
  res.end(content);
};

var fail = function(req, res) {
  console.log(500, req.url);

  var message = "Catastrophic failure."
  res.writeHead(500, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': Buffer.byteLength(message, 'utf8')
  });
  res.end(message);
};

exports.handler = function(req, res) {
  // Build/sanitize
  var path = req.url.substr('/frontend/'.length);
  path = path.replace(/\.\./g, '')
             .replace(/\/\//g, '/')
             .replace(/^\//, '')
             ;
  var fileName = fsPath.join.apply(fsPath, ['.', 'frontend'].concat(path.split('/')));

  // Serve directly from cache if possible
  if (cache.hasOwnProperty(fileName)) {
    serve(res, fileName);

  // Build it up if needed
  } else {
    fs.readFile(fileName, function(err, data) {
      if (err) {
        console.log('Error reading static file', fileName);
        console.log(err.stack || err.message || err);
        return fail(req, res);
      }
      try {
        cache[fileName] = convertContent(path, data);
      } catch (err) {
        console.log('Error building file', fileName);
        console.log(err.stack || err.message || err);
        return fail(req, res);
      }
      serve(res, fileName);

      // In debug mode, reload assets constantly
      if (config.debug)
        delete cache[fileName];
    });
  }

};
