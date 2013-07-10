bh.creation = {};

(function() {
  var stack = [];
  var procedure = [ 'initiation'
                  // , 'intrusion'
                  // , 'completion'
                  // , 'expulsion'

                  , 'anger'
                  , 'love'
                  , 'fear'
                  , 'sadness'
                  , 'joy'
                  , 'surprise'
                  ];


  bh.creation.next = function() {
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


setTimeout(bh.creation.next, 100);
