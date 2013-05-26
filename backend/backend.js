var modules = [ './creation'
              , './dashboard'
              ];

exports.init = function() {

  var handlers = [];
  for (var i=0; i<modules.length; i++)
    handlers = handlers.concat(require(modules[i]).handlers);

  return handlers;
};