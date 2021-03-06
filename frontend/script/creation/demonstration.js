bh.creation.demonstration = function() {

  // Util
  var shuffle = function(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  };

  var $ = function(sel) {
    return document.querySelectorAll('#demonstration ' + sel);
  };

  // Data
  var hash = bh.hashData(bh.creation.preservedData);
  var times = bh.calcTimes(bh.creation.preservedData);
  console.log(times);

  var showText = function() {
    $('h1')[0].className += ' visible';
    setTimeout(function() {
      $('h1')[0].className += ' gone';
      setTimeout(showHexagon, 1000);
    }, 2000);
  };

  var showHexagon = function() {

    // Pipe that data into the hexagon generator, and insert the resulting hexagon
    document.querySelector('#demonstration').appendChild(bh.hexagon(hash));

    // Animate the resulting SVG smoothly
    var polygons = Array.prototype.slice.call($('svg polygon'));
    polygons = shuffle(polygons);
    var dir = '0';
    for (var i=0; i<polygons.length; i++) {
      polygons[i].setAttribute('class', 'nekkid' + dir);
      if (++dir > 3)
        dir = 0;
      setTimeout((function(i) { return function() {
        polygons[i].setAttribute('class', '');
      }})(i), i * 10);
    }

    // Fade in the bg part
    setTimeout(function() {
      $('.bg')[0].className += ' visible';
    }, 4000);

    // Show the final form after a time
    //setTimeout(showForm, 9000);
  };

  var showForm = function() {
    var xhr = null;

    $('form')[0].className = 'visible';
    $('form')[0].addEventListener('submit', function(e) {
      e.preventDefault();

      // Send the email. and continue onwards when it's done
      var email = $('input[type="email"]')[0].value;
      xhr = new XMLHttpRequest();
      xhr.open('POST', '/email');
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4)
          leave();
      };
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({email: email, hash: bh.creation.storedDataId}));
    });

    var handler = function() {
      if (xhr) {
        xhr.abort();
        xhr = null;
      }
      leave();
    };
    $('form a')[0].addEventListener('touchstart', handler, false);
    $('form a')[0].addEventListener('click', handler, false);
  };

  var leave = function() {
    var inputs = $('input');
    for (var i=0; i<inputs.length; i++)
      inputs[i].disabled = true;

    $('.bg')[0].style.display = 'none';
    $('svg')[0].style.display = 'none';
    document.querySelector('#demonstration').className += ' orange';
    $('form')[0].className = 'form';
    setTimeout(function() {
      bh.creation.next();
    }, 600);
  };

  // Go
  setTimeout(showText, 100);
  return bh.templates.demonstration({
    hash: bh.creation.storedDataId || hash.substr(0, 8),
    timing: times
  });
};
