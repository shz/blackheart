bh.creation.initiation = function() {
  var w = document.createElement('div');
  w.innerHTML = bh.templates.initiation();
  var handler = function(e) {
    e.preventDefault();

    var audio = new Audio();
    audio.src = '/frontend/audio/soundtrack.mp3';
    audio.loop = true;
    audio.play();

    clearInterval(animInterval);

    bh.creation.next();
  };
  w.addEventListener('touchstart', handler, false);
  w.addEventListener('click', handler, false);

  var hex = null;
  var animInterval = setInterval(function() {
    if (!hex)
      hex = document.querySelector('#initiation .flip-hex');

    if (hex.className.match(/flipped/))
      hex.className = hex.className.replace(' flipped', '');
    else
      hex.className += ' flipped';

  }, 3000);

  return [ w ];
};
