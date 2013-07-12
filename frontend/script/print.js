(function() {

  var getData = function(id, callback) {
    callback(id);
  };

  var showThings = function(data) {
    var hash = data;
    document.getElementById('demonstration').innerHTML = bh.templates.demonstration({hash: hash, avg: 1});
    document.getElementById('demonstration').appendChild(bh.hexagon(hash));
    document.querySelector('#demonstration .bg').className += ' visible';

    var forms = document.querySelectorAll('form');
    for (var i=0; i<forms.length; i++)
      forms[i].style.display = 'none';

    setTimeout(doPrint, 1000);
  };

  var doPrint = function() {
    // window.print();
  };

  var reload = function() {
    window.location.reload();
  };

  // Bootstrap by listening for form submits
  setTimeout(function() {
    document.querySelector('form').addEventListener('submit', function(e) {
      e.preventDefault();

      getData(document.querySelector('input').value, showThings);
    }, false);
  }, 100);

  // Once a print has happened, reload
  if (window.matchMedia) {
    var mql = window.matchMedia('print');
    mql.addListener(function(mql) {
      if (!mql.matches)
        reload();
    });
  }

})();
