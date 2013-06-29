bh.creation.intrusion = function() {
  var d = document.createElement('div');
  d.innerHTML = bh.templates.intrusion();

  var $ = function() { return document.querySelector.apply(document, arguments); };

  // Run the initial infinity animation
  setTimeout(function() {
    var o = $('#intrusion .first object');
    var p = $('#intrusion .first p');
    o.setAttribute('data', o.getAttribute('data-data'));
    o.onload = function() {
      setTimeout(function() {
        p.className = 'visible';
        setTimeout(function() {
          p.className = 'visible fade';
        }, 2000);
        setTimeout(storyAnimation, 2750);
      }, 1450);
    };
  }, 1000);

  var storyAnimation = function() {
    var second = $('#intrusion .second');
    second.className += ' visible';

    // Give time for the logo to animate in
    var t = 1000;

    // Bring in the text
    var yearEl = $('#intrusion .second .year');
    var year = 2013;
    var runYear = function() {
      yearEl.textContent = year;

      if (year++ < 2045)
        setTimeout(runYear, 50);
      else
        yearEl.className = 'year visible done';
    };
    yearEl.className = 'year visible'
    setTimeout(runYear, 600);
    t += 2600;

    // Animate in the paragraphs
    var q = document.querySelectorAll('#intrusion .second p');
    for (var i=0; i<q.length; i++) {
      (function(i) {
        setTimeout(function() {
          q[i].className += ' visible';
        }, t);
      })(i);
      t += 2400;
    }

    // Bind to clicking one the ending text has started to appear
    setTimeout(function() {
      var handler = function(e) {
        e.preventDefault();
        bh.creation.next();
      };
      d.addEventListener('touchstart', handler, false);
      d.addEventListener('click', handler, false);
    }, t - 2400);

    // Pulse the ending text
    i--;
    setTimeout(function() {
      q[i].className = 'visible orange';
      setInterval(function() {
        if (q[i].className == 'visible orange')
          q[i].className = 'visible';
        else
          q[i].className = 'visible orange';
      }, 2200);
    }, t);
  };

  return [d];
};
