bh.creation.initiation = function() {
  var w = document.createElement('div');
  w.innerHTML = bh.templates.initiation();
  var handler = function(e) {
    e.preventDefault();

    var audio = new Audio();
    audio.src = '/frontend/audio/soundtrack.mp3';
    audio.loop = true;
    audio.play();

    bh.creation.next();
  };
  w.addEventListener('touchstart', handler, false);
  w.addEventListener('click', handler, false);

  return [ w ];
};
