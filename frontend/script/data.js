bh.data = {};
bh.data.save = function(data, callback) {
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

      if (xhr.status != 200)
        return callback(new Error('Status ' + xhr.status));

      callback();
    }
  };
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
};
