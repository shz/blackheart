bh.creation.intrusion = function() {
  var d = document.createElement('div');
  d.innerHTML = bh.templates.intrusion();

  // Run the initial infinity animation
  setTimeout(function() {
    var o = document.querySelector('#intrusion .first object');
    var p = document.querySelector('#intrusion .first p');
    o.setAttribute('data', o.getAttribute('data-data'));
    o.onload = function() {
      setTimeout(function() {
        p.className = 'visible';
        setTimeout(function() {
          p.className = 'visible fade';
        }, 1000);
        setTimeout(storyAnimation, 2000);
      }, 2000);
    };
  }, 2000);

  var storyAnimation = function() {

  };

  return [d];
};
