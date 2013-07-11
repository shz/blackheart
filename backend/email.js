var mailgun = require('mailgun');

var mg = null;
try {
  var config = require('../email.json');
  if (!config.key) {
    console.log('Bad email config');
    throw new Error('Bad config');
  }
  mg = new mailgun.Mailgun(config.key);
} catch (err) {}

var respond = function(res, status, data) {
  data = new Buffer(JSON.stringify(data));
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  })
  res.end(data);
  console.log(status, '/email');
};

exports.handler = function(req, res) {
  if (req.method != 'POST')
    respond(res, 400, {error: 'Invalid method'});
  if (!config)
    respond(res, 500, {error: 'No config'});

  var data = [];
  req.on('data', function(c) { data.push(c) });
  req.on('close', function() { data = null });
  req.on('end', function() {
    try {
      data = JSON.parse(Buffer.concat(data).toString('utf8'));
    } catch (err) {
      console.log('Bad POST to /email');
      console.log(err.stack || err.message || err);
      console.log(400, req.url);
      return respond(res, 400, {error: 'Bad JSON man'});
    }

    // Make sure we've got an email and a hash
    if (!data.email || !data.hash)
      return respond(res, 400, {error: 'Missing field(s)'});

    if (mg) {
      var from = 'The Human Preservation Initiative <lab@humanpreservationinitiative.mailgun.org>';
      var subject = 'Your Individual Emotional Imprint code';
      var body =  "Thank you for your participation in our scientific efforts. It's people like you that make our species worth preserving.\n\n";
          body += "You may purchase a print of your Individual Emotional Imprint for $5 at the front desk. Simply show the attendant your unique code below:\n\n";
          body += data.hash + '\n\n';
          body += "Also please visit http://humanpreservationinitiative.com for updates on this project, including a visualization of all data we collect.\n\n";
          body += "Yours,\nThe Human Preservation Initiative";

      mg.sendText(from, data.email, subject, body, 'humanpreservationinitiative.mailgun.org');
    }

    // Respond nicely
    respond(res, 200, {achievement: 'great success'});
  });
};