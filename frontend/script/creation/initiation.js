bh.creation.initiation = function() {
  var w = document.createElement('div');
  w.innerHTML = bh.templates.initiation();
  var handler = function(e) {
    e.preventDefault();
    bh.creation.next();
  };
  w.addEventListener('touchstart', handler, false);
  w.addEventListener('click', handler, false);

  return [ w ];
};
