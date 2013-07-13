(function() {
  var hex = null;
  var animInterval = setInterval(function() {
    if (!hex)
      hex = document.querySelector('.flip-hex');

    if (hex.className.match(/flipped/))
      hex.className = hex.className.replace(' flipped', '');
    else
      hex.className += ' flipped';

  }, 3000);
})();
