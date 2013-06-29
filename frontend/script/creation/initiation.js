bh.creation.initiation = function() {
  var animation1 = document.createElement('div');
  animation1.innerHTML = bh.templates.initiation({image: 'smiley-large-white'});
  animation1.childNodes[0].className += ' white'
  animation1.className = 'visible';

  var animation2 = document.createElement('div');
  animation2.innerHTML = bh.templates.initiation({image: 'skull-large-black'});
  animation2.childNodes[0].className += ' orange'
  animation2.className = '';

  var handler = function(e) {
    e.preventDefault();
    bh.creation.next();
  };
  animation1.addEventListener('touchstart', handler, false);
  animation1.addEventListener('click', handler, false);
  animation2.addEventListener('touchstart', handler, false);
  animation2.addEventListener('click', handler, false);

  var cycle = function() {
    if (animation1.className == 'visible') {
      animation1.className = '';
      animation2.className = 'visible';
    } else {
      animation1.className = 'visible';
      animation2.className = ''
    }

    setTimeout(cycle, 2600);
  };
  setTimeout(cycle, 2000);

  return [ animation1, animation2 ];
};
