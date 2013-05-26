exports.handlers = [];

var main = function() {
  this.reply.view('dashboard', {});
};

exports.handlers.push({
  method: 'GET',
  path: '/',
  config: {
    handler: main
  }
});