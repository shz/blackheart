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

var convertContent = function(path, content, callback) {
  var ext = getExtension(path);

  switch (ext) {
    case 'jade':
      try {
        content = new Buffer('bh.templates["' + getFile(path) + '"] = ' + jade.compile(content.toString(), {
          filename: path,
          compileDebug: config.debug,
          client: true
        }));
        return callback(undefined, content);
      } catch (err) {
        return callback(err);
      }

    case 'styl':
      stylus.render(content.toString(), {
        filename: path,
        paths: [] // TODO - extra import paths?
      }, function(err, css) {
        return callback(err, css ? Buffer(css) : undefined);
      });
      break;

    default:
      return callback(undefined, content);
  }
};

var serve = function(res, path) {
  var ext = getExtension(path);
  var contentType = 'application/octet-steam';
  switch (ext) {
    case 'png':
      contentType = 'image/png';
      break;
    case 'styl':
      contentType =' text/css; charset=utf-8';
      break;
    case 'js':
      contentType = 'application/javascript; charset=utf-8';
      break;
    case 'jade':
      contentType = 'application/javascript; charset=utf-8';
      break;
    case 'appcache':
      contentType = 'text/cache-manifest';
      break;
    case 'svg':
      contentType = 'image/svg+xml';
      break;
    case 'otf':
      contentType = 'font/opentype';
      break;
    case 'html':
      contentType = 'text/html; charset=utf-8';
      break;
  }

  var content = cache[path];
  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': content.length
  });
  res.end(content);
  console.log('200', path);
};

var fail = function(req, res) {
  var message = "Catastrophic failure."
  res.writeHead(500, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': Buffer.byteLength(message, 'utf8')
  });
  res.end(message);
  console.log(500, req.url);
};

exports.handler = function(req, res) {
  // Build/sanitize
  var path = req.url.substr('/frontend/'.length).split('?')[0];
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

      convertContent(path, data, function(err, data) {
        if (err) {
          console.log('Error building file', fileName);
          console.log(err.stack || err.message || err);
          return fail(req, res);
        }

        cache[fileName] = data;
        serve(res, fileName);

        // In debug mode, reload assets constantly
        if (config.debug)
          delete cache[fileName];
      });
    });
  }
};
