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
    document.querySelector('#demonstration').appendChild(bh.hexagon());
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
