bh.creation.expulsion = function() {
  setTimeout(function() {
    var hex = document.querySelector('#expulsion .hex');

    hex.className += ' in';
    setTimeout(function() {
      hex.className += ' out';
      setTimeout(function() {
        window.location.reload();
      }, 1200);
    }, 3000);
  }, 100);

  return bh.templates.expulsion();
};
