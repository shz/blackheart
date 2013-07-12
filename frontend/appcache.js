var glob = require('glob')
  , path = require('path')
  ;

var cache = [ '/'
            , '/create'
            ];

var network = [ '/data'
              , '/email'
              ];

var fallback = [

               ];

var makeCache = function(callback) {
  glob(__dirname + '/**/*.*', function(err, matches) {
    if (err) return callback(err);

    var c = 'CACHE MANIFEST\n';
    c += '# At ' + Date.now() + '\n';

    // Add cache part
    c += '\nCACHE:\n';
    c += cache.join('\n');
    c += '\n';

    // Add sniffed entries
    for (var i=0; i<matches.length; i++)
      if (matches[i].match(/\/frontend\/\w+\/.*\.\w+$/))
        c += '/frontend' + matches[i].split('/frontend')[1] + '\n';

    // Add network part
    c += '\nNETWORK:\n';
    c += network.join('\n');
    c += '\n';

    // Add fallback part
    c += '\nFALLBACK:\n';
    c += fallback.join('\n');

    callback(undefined, c);
  });
};

var serveCache = function(res, cache) {
  console.log(200, '/appcache');
  var data = new Buffer(cache, 'utf8');
  res.writeHead(200, {
    'Content-Type': 'text/cache-manifest',
    'Content-Length': data.length
  });
  res.end(data);
};

var serveError = function(res) {
  console.log(500, '/appcache');
  res.writeHead(500, {'Content-Type': 'text/plain; charset=utf=8'});
  res.end('Error');
};

var cachedCache = null;
exports.handler = function(req, res) {
  if (cachedCache)
    return serveCache(res, cachedCache);

  makeCache(function(err, cache) {
    if (err) {
      console.log('Error building appcache: ' + err.stack || err.message || err);
      return serveError(res);
    }
    cachedCache = cache;
    return serveCache(res, cachedCache);
  });
};
