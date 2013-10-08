bh.creation.completion = function() {
  var $ = function(sel) {
    return document.querySelectorAll('#completion ' + sel);
  };

  // Save the data
  bh.data.save(bh.creation.preservedData, function(err, id) {
    if (!err)
      bh.creation.storedDataId = id;
  });

  var p;
  var object;
  var updateText = function(txt, callback) {
    if (!p)
      p = $('p')[0];
    if (!object)
      object = $('object')[0];

    // Let the SVG animation ride out for a bit
    setTimeout(function() {

      // Prep the text and animate it in
      p.innerHTML = txt;
      p.className = '';
      p.offsetLeft;
      p.className = 'visible';

      // When the text has been visible for a bit, fade it out
      setTimeout(function() {
        p.className = 'visible fade';

        // When the fade is completed, prep for a further animation
        setTimeout(function() {
          p.classname = '';
          callback();
        }, 700);
      }, 3300);

    }, 100);
  };

  // Swing header down
  setTimeout(function() {
    $('.selection-header')[0].className += ' down';

    // Fly in hex
    setTimeout(function() {
      var hex = $('.hex')[0];
      hex.className += ' in';

      // Show logo
      setTimeout(function() {
        var p = $('p')[0];
        var o = document.createElement('object');
        o.setAttribute('type', 'image/svg+xml');
        o.setAttribute('data', bh.createInfinityPath());
        hex.parentElement.insertBefore(o, hex);

        o.onload = function() {
          updateText('Creating composite rendering', function() {
            hex.className += ' out';
            setTimeout(bh.creation.next, 600);
          });
        };
      }, 1000);
    }, 600);
  }, 100);

  return bh.templates.completion();
};
