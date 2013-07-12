bh.data = {};
bh.data.save = function(data, callback) {
  if (!callback)
    callback = function() {};

  var aborted = false;
  var finished = false;
  setTimeout(function() {
    if (!finished) {
      aborted = true;
      finished = true;
      xhr.abort();
      callback(new Error('Timed out'));
    }
  }, 5000);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/data')
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      finished = true;
      if (aborted)
        return;

      if (xhr.status != 201)
        return callback(new Error('Status ' + xhr.status));

      var id = null;
      var err = null;
      try {
        id = JSON.parse(xhr.responseText).id;
      } catch (e) { err = e }

      if (id)
        callback(undefined, id);
      else
        callback(err);
    }
  };
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
};

bh.data.load = function(key, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/data?key=' + key);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      try {
        if (xhr.status != 200)
          throw new Error('Status ' + xhr.status);

        callback(undefined, JSON.parse(xhr.responseText));
      } catch (err) {
        callback(err);
      }
    }
  };
  xhr.send();
};
