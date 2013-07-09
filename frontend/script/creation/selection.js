(function() {
  var selection = function(name) {
    return function() {
      var w = document.createElement('div');
      w.innerHTML = bh.templates.selection({
        name: name
      });

      var id = null;
      var done = false;

      var finish = function(num) {
        var opts = document.querySelectorAll('#' + id + ' .pieces a');

        // Negative index means no selection
        if (num < 0) {
          for (var i=0; i<opts.length; i++) {
            opts[i].className += ' gone';
          }

          // TODO - Record data

          setTimeout(bh.creation.next, 2000);
        }
      };

      setTimeout(function() {
        id = w.parentElement.id;
        document.querySelector('#' + id + ' .name').className = 'name visible';
        document.querySelector('#' + id + ' .pieces').className = 'pieces visible';

        setTimeout(function() {
          var counter = document.querySelector('#' + id + ' .counter');
          counter.className += ' visible';
          counter.offsetLeft;
          counter.className += ' regular';
        }, 2000);

        setTimeout(function() {
          var ss = document.querySelectorAll('#' + id + ' .counter div');

          // Animate away the sections of the clock
          for (var i=0; i<ss.length; i++) {
            setTimeout((function(i) { return function() {
              if (done)
                return;

              ss[i].className += ' done';
            }})(i), i * 1000);
          }

          // Auto-finish if time runs out
          setTimeout(function() {
            if (done) return;

            finish(-1);
          }, 6000 + 400);
        }, 3000);
      }, 1000);

      return [w];
    };
  };

  bh.creation.love = selection('Love');
  bh.creation.sadness = selection('Sadness');

})();
