bh.creation = {};

(function() {
  var stack = [];
  var procedure = [ 'initiation'
                  , 'intrusion'

                  , 'anger'
                  , 'love'
                  , 'fear'
                  , 'sadness'
                  , 'joy'
                  , 'surprise'

                  , 'completion'
                  , 'demonstration'
                  , 'expulsion'
                  ];


  bh.creation.next = function() {
    // After a reasonable amount of time, remove previous entries for
    // performance/stability.
    var prev = document.querySelector('body > div.underway');
    if (prev) {
      setTimeout(function() {
        document.body.removeChild(prev);
      }, 2000);
    }

    (stack.pop() || {}).className = 'performed';
    var next = document.createElement('div');
    next.id = procedure.shift();
    var content = bh.creation[next.id]();
    if (typeof content == 'string')
      next.innerHTML = content;
    else
      content.forEach(function(el) { next.appendChild(el) });
    stack.push(next);
    document.body.appendChild(next);
    next.offsetLeft;
    next.className = 'underway';
  };
})();

window.addEventListener('DOMContentLoaded', bh.creation.next);
