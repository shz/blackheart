(function() {
  var selection = function(name) {

    return function() {
      var w = document.createElement('div');
      w.innerHTML = bh.templates.selection({
        name: name
      });

      var $ = function(sel) {
        console.log('#' + w.parentElement.id + ' ' + sel);
        return document.querySelectorAll('#' + w.parentElement.id + ' ' + sel);
      };

      var id = null;
      var done = false;

      var finish = function(num) {
        done = true;

        $('h1.name')[0].className = 'name';

        var ss = $('.counter div');
        for (var i=0; i<ss.length; i++)
          ss[i].className += ' done';

        var pieces = Array.prototype.slice.call($('.pieces .flip-hex'));
        if (num >= 0) {
          for (var i=0; i<num+1; i++)
            pieces.push(pieces.shift());
        }
        for (var i=0; i<pieces.length; i++) {
          setTimeout((function(i) { return function() {
            pieces[i].className = pieces[i].className.replace('flipped', '');

            if (i == 5)
              setTimeout(bh.creation.next, 1000);
          }})(i), i * 300);
        }
      };

      // Track tile clicks
      var bindClicks = function() {
        var pieces = $('.pieces .flip-hex');
        for (var i=0; i<pieces.length; i++) {
          (function(i) {
            var handler = function(e) {
              e.preventDefault();

              pieces[i].className += ' selected';

              if (done) return;
              finish(i);
            };
            pieces[i].addEventListener('click', handler, false);
            pieces[i].addEventListener('touchstart', handler, false);
          })(i);
        }
      };

      // Animation pieces

      var showInstructions = function() {
        $('.instructions')[0].className += ' hidden';
        setTimeout(animateInTiles, 1000);
      };

      var animateInTiles = function() {
        $('h1.name')[0].className += ' visible';

        var pieces = $('.pieces .flip-hex');
        for (var i=0; i<pieces.length; i++) {
          setTimeout((function(i) { return function() {
            if (done)
              return;

            pieces[i].className += ' flipped';

            if (i == 5) {
              bindClicks();
              setTimeout(animateInClock, 400);
            }
          }})(i), i * 300);
        }
      };

      var animateInClock = function() {
        var counter = $('.counter')[0];
        counter.className += ' visible';
        counter.offsetLeft;
        counter.className += ' regular';

        setTimeout(runClock, 1000);
      };

      var runClock = function() {
        var ss = $('.counter div');

        // Animate away the sections of the clock
        for (var i=ss.length-1; i>=0; i--) {
          setTimeout((function(i) { return function() {
            if (done)
              return;

            ss[i].className += ' done';
          }})(i), (ss.length - i) * 1000);
        }

        // Auto-finish if time runs out
        setTimeout(function() {
          if (done) return;

          finish(-1);
        }, 6000 + 400);
      };

      // Bootstrap
      setTimeout(showInstructions, 1000);

      return [w];
    };
  };

  bh.creation.anger = selection('Anger');
  bh.creation.love = selection('Love');
  bh.creation.fear = selection('Fear');
  bh.creation.sadness = selection('Sadness');
  bh.creation.joy = selection('Joy');
  bh.creation.surprise = selection('Surprise');

})();
