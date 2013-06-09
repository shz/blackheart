// TODO -- aggregate data somehow

var fs = require('fs')
   , path = require('path')
   ;

var respond = function(res, status, data) {
  data = new Buffer(JSON.stringify(data));
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  })
  res.end(data);
  console.log(status, '/data');
};

exports.handler = function(req, res) {
  if (req.method == 'POST') {
    var data = [];
    req.on('data', function(c) { data.push(c) });
    req.on('close', function() { data = null });
    req.on('end', function() {
      try {
        data = JSON.parse(Buffer.concat(data).toString('utf8'));
      } catch (err) {
        console.log('Bad POST to /data');
        console.log(err.stack || err.message || err);
        console.log(400, req.url);
        return;
      }

      // Add data to the aggregate
      // TODO

      // And save it away
      saveChunk(data);

      // Respond nicely
      respond(res, 201, {achievement: 'great success'});
    });

  } else {
    // Bootstrap aggregate
    // TODO

    respond(res, 200, {hi: '!'});
  }
};

//////////////////////////////////
// Aggregation
//////////////////////////////////

var aggregate = null;
var updateAggregate = function(data) {

};

//////////////////////////////////
// File business
//////////////////////////////////

// Path to our data file
var dataPath = path.join('.', 'data.bin');

// Data saving
var filew = fs.createWriteStream(dataPath, { flags: 'w+'});
filew.on('open', function(fd) { filew.fd = fd; });
var chunkCache = [];
var chunkWriting = false;
var saveChunk = function(data) {
  data = new Buffer(JSON.stringify(data));
  chunkCache.push(data);

  if (!chunkWriting) {
    var doWrite = function() {
      chunkWriting = true;
      var b = new Buffer(4);
      b.writeInt32LE(chunkCache[0].length, 0);
      filew.write(b, function() {
        filew.write(chunkCache.shift(), function() {
          var cont = function() {
            if (chunkCache.length)
              doWrite();
            else
              chunkWriting = false;
          };

          if (filew.fd !== undefined)
            fs.fsync(filew.fd, cont);
          else
            cont();
        });
      });
    };
    doWrite();
  }
};

// Reading
var readAll = function(visitor) {
  var file = fs.createReadStream(dataPath);
  find.on('data', function(c) {
    // TODO - Parse and stuff
  });

  // We ignore all other events -- errors and such are
  // silent.
};
