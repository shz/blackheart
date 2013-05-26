exports.handlers = [];

var main = function() {
  this.reply.view('creation', {});
};

exports.handlers.push({
  method: 'GET',
  path: '/create',
  config: {
    handler: main
  }
});