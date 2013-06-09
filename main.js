var http = require('http')
  , config = require('./config')
  , creation = require('./backend/creation')
  , dashboard = require('./backend/dashboard')
  , data = require('./backend/data')
  , frontend = require('./frontend/frontend')
  , helpers = require('./helpers')
  ;

console.log('Blackheart ' + require('./package.json').version);

// HTTP
var server = new http.Server();
server.on('request', function(req, res) {
  for (var i in routes)
    if (req.url.match(new RegExp(i)))
      return routes[i](req, res, helpers.make(req, res));

  // Default case: 404 at them
  helpers.make(req, res).template('404', 404);
});
server.listen(config.port, config.host);
console.log('Listening on ' + config.host + ':' + config.port);
console.log('');

// Routes
var routes =
{ '^/$': dashboard.handler
, '^/create$': creation.handler
, '^/frontend/': frontend.handler
, '^/data': data.handler
};
