bh.creation.demonstration = function() {

  // Util
  var shuffle = function(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  };

  var $ = function(sel) {
    return document.querySelectorAll('#demonstration ' + sel);
  };

  // Steps

  var showText = function() {
    $('h1')[0].className += ' visible';
    setTimeout(function() {
      $('h1')[0].className += ' gone';
      setTimeout(showHexagon, 1000);
    }, 2000);
  };

  var showHexagon = function() {

    // Generate the SHA1 hash of the user data
    var words = CryptoJS.SHA1(JSON.stringify(bh.creation.preservedData)).words;
    var hash = '';
    for (var i=0; i<words.length; i++) {
      var n = words[i];
      if (n < 0)
        n = 0xFFFFFFFF + n + 1;
      n = n.toString(16);
      while (n.length < 8)
        n = '0' + n;
      hash += n;
    }

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
  };

  // Go
  setTimeout(showText, 100);
  return bh.templates.demonstration();
};
