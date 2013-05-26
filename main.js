var Hapi = require('hapi')
  , backend = require('./backend/backend')
  , frontend = require('./frontend/frontend')
  ;

var debug = true; // TODO - Make not true in production
var port = parseInt(process.argv[2] || 8000);
var host = '0.0.0.0';
console.log('Blackheart ' + require('./package.json').version);

var server = Hapi.createServer(host, port, {
  router: {
    isCaseSensitive: false
  },
  views: {
    path: 'frontend/templates',
    isCached: !debug,
    engines: {
      jade: 'jade'
    }
  }
});

// Backend
server.route(backend.init());
console.log('Backend initialized');

// Frontend
server.route(frontend.init());
console.log('Frontend initialized');

// 404 Handlers
server.route({
  method: '*',
  path: '/{p*}',
  handler: function() {
    this.reply.view('404');
  }
});

server.start();
console.log('Listening on ' + host + ':' + port);
console.log('');