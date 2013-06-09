var jade = require('jade')
  , fs = require('fs')
  , path = require('path')
  , config = require('./config')
  ;

var templateCache = {};

var fail = function(req, res) {
  var message = "Catastrophic failure."
  res.writeHead(500, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': Buffer.byteLength(message, 'utf8')
  });
  res.end(message);
  console.log(500, req.url);
};

exports.make = function(req, res) {
  return {
    template: function(name, data, statusCode) {

      // Argument handling
      if (typeof data == 'number') {
        statusCode = data;
        data = undefined;
      }
      data = data || {};
      statusCode = statusCode || 200;

      // Render cached template
      var cont = function() {
        try {
          var result = templateCache[name](data);
        } catch (err) {
          console.log('Error processing template', name);
          console.log(err.stack || err.message || err);
          return fail(req, res);
        }

        res.writeHead(statusCode, {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Length': Buffer.byteLength(result, 'utf8')
        });
        res.end(result);
        console.log(statusCode, req.url, '=>', fileName);
      };

      // Attempt to use stored templated
      if (templateCache.hasOwnProperty(name)) {
        cont();

      // Compile template if needed
      } else {
        var fileName = path.join('.', 'backend', 'templates', name + '.jade');
        fs.readFile(fileName, {encoding: 'utf8'}, function(err, data) {
          if (err) {
            console.log('Error reading template file', fileName);
            console.log(err.stack || err.message || err);
            return fail(req, res);
          }
          try {
            templateCache[name] = jade.compile(data, { filename: fileName });
          } catch (err) {
            console.log('Error compiling template file', fileName);
            console.log(err.stack || err.message || err);
            return fail(req, res);
          }
          cont();

          if (config.debug)
            delete templateCache[name];
        });
      }
    }
  };
};
