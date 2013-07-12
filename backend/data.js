var nstore = require('nstore');

var dbDoCallbacks = [];
var db = nstore.new('db.nstore', function() {
  for (var i=0; i<dbDoCallbacks.length; i++)
    dbDoCallbacks(db);
  dbDoCallbacks = null;
});
var dbDo = function(f) {
  if (dbDoCallbacks)
    dbDoCallbacks.push(f);
  else
    f(db);
};

var makeId = function() {
  var s = (Date.now() % 16).toString(16);
  for (var i=0; i<7; i++)
    s = ((Math.random() * 16)|0).toString(16) + s;
  return s;
}

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
  if (req.method == 'GET') {
    var id = req.url.split('?key=')[1];
    if (!id)
      return respond(res, 400, {error: 'no key'});

    dbDo(function(db) {
      db.get(id.toLowerCase(), function(err, doc, key) {
        if (err)
          respond(res, 500, {error: err.stack || err.message || err});
        else
          respond(res, 200, doc);
      });
    });
  }

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
        return respond(res, 400, {error: 'Bad JSON man'});
      }

      // Add data to the aggregate
      // TODO

      // And save it away
      dbDo(function(db) {
        var id = makeId();
        db.save(id, data, function(err) {
          if (err)
            respond(res, 500, {error: err.stack || err.message || err});
          else
            respond(res, 201, {id: id});
        });
      });
    });

  }
};

//////////////////////////////////
// Aggregation
//////////////////////////////////

var aggregate = null;
var updateAggregate = function(data) {

};

