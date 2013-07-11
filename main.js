var http = require('http')
  , config = require('./config')
  , creation = require('./backend/creation')
  , dashboard = require('./backend/dashboard')
  , data = require('./backend/data')
  , email = require('./backend/email')
  , frontend = require('./frontend/frontend')
  , appcache = require('./frontend/appcache')
  , helpers = require('./helpers')
  ;

console.log('Blackheart ' + require('./package.json').version);

// HTTP
var server = new http.Server();
server.on('request', function(req, res) {
  for (var i in routes)
    if (req.url.match(new RegExp(i)))
      return routes[i](req, res, helpers.make(req, res));

  // Default case: redirect to the dashboard
  res.writeHead(301, {'Location': 'http://' + req.headers.host + '/'});
  res.end();
});
server.listen(config.port, config.host);
console.log('Listening on ' + config.host + ':' + config.port);
console.log('');

// Routes
var routes =
{ '^/$': dashboard.handler
, '^/create$': creation.handler

, '^/frontend/': frontend.handler
, '^/appcache$': appcache.handler

, '^/data$': data.handler
, '^/email$': email.handler
};
