var makeHandler = function(pub, pri) {
  return {
    method: 'GET',
    path: '/' + pub + '/{path*}',
    handler: {
      directory: {
        path: './frontend/' + pri + '/',
        listing: false
      }
    }
  };
};

var compileStylus = function() {
  console.log('TODO - Compile Stylus');
};

var compileJs = function() {
  console.log('TODO - Compile JS');
};

exports.init = function() {
  compileStylus();
  compileJs();

  return [ makeHandler('image', 'image')
         , makeHandler('script', 'script')
         ];
};