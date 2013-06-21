bh.creation = {};

(function() {
  var stack = [];
  var procedure = [ 'intrusion'
                  , 'instruction'
                  , 'completion'
                  , 'expulsion'
                  ];


  bh.creation.next = function() {
    (stack.pop() || {}).className = 'performed';
    var next = document.createElement('div');
    next.id = procedure.shift();
    bh.creation[next.id]().forEach(function(el) { next.appendChild(el) });
    stack.push(next);
    document.body.appendChild(next);
    next.offsetLeft;
    next.className = 'underway';
  };
})();


setTimeout(bh.creation.next, 100);
