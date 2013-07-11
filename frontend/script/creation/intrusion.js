bh.creation.intrusion = function() {
  var d = document.createElement('div');
  d.innerHTML = bh.templates.intrusion();

  var $ = function() { return document.querySelector.apply(document, arguments); };

  // Run the initial infinity animation
  setTimeout(function() {

    // Animate in the hex
    var hex = $('#intrusion .first .hex');
    hex.className = 'hex in';

    setTimeout(function() {

      var p = $('#intrusion .first p');
      var o = document.createElement('object');
      o.setAttribute('type', 'image/svg+xml');
      o.setAttribute('data', '/frontend/image/infinity_path.svg');
      hex.parentElement.insertBefore(o, hex);

      o.onload = function() {
        setTimeout(function() {
          p.className = 'visible';
          setTimeout(function() {
            p.className = 'visible fade';
          }, 2000);

          setTimeout(function() {
            hex.className = 'hex in out';
            setTimeout(storyAnimation, 800);
          }, 2750);
        }, 1450);
      };
    }, 1000);
  }, 1000);

  var storyAnimation = function() {
    var second = $('#intrusion .second');
    second.className += ' visible';
    $('#intrusion .first').className += ' hidden';

    var hex = $('#intrusion .second .hex');
    hex.offsetLeft;
    hex.className += ' in';

    // Give time for the hex to animate in
    var t = 1000;
    setTimeout(function() {
      yearEl.className = 'year visible';
    }, t);

    // Bring in the text
    var yearEl = $('#intrusion .second .year');
    var year = 2013;
    var runYear = function() {
      yearEl.textContent = year++;

      if (year == 2014) {
        setTimeout(runYear, 550);
      } else if (year <= 2045) {
        setTimeout(runYear, 50);
      } else {
        setTimeout(function() {
          yearEl.className = 'year visible done';
          hex.className += ' out';
        }, 400)
      }
    };
    setTimeout(runYear, t);
    t += 3500;

    // Animate in the paragraphs
    setTimeout(function() {
      $('#intrusion .second .text').className += ' visible';
    }, t);
    t += 2500;

    // Bind to clicking once the ending text has started to appear
    setTimeout(function() {
      var handler = function(e) {
        e.preventDefault();

        var audio = bh.creation.clickAudio = new Audio();
        audio.src = '/frontend/audio/click.mp3';
        audio.load();

        $('#intrusion .second .text').className += ' hidden';
        $('#intrusion .second .orange-block').className += ' visible';

        setTimeout(function() {
          $('#intrusion .second .hex').className += ' gone';
          $('#intrusion .third').className += ' visible';
          $('#intrusion .second .orange-block').className += ' up';
          document.body.offsetLeft;

          setTimeout(bh.creation.next, 1200);
        }, 700);
      };
      d.addEventListener('touchstart', handler, false);
      d.addEventListener('click', handler, false);
    }, t);

    // Pulse the ending text
    setTimeout(function() {
      var el = $('#intrusion .second .text p:last-child');
      el.className = 'visible orange';
      setInterval(function() {
        if (el.className == 'visible orange')
          el.className = 'visible';
        else
          el.className = 'visible orange';
      }, 1200);
    }, t);
  };

  return [d];
};
