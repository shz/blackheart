bh.creation.completion = function() {
  var $ = function(sel) {
    return document.querySelectorAll('#completion ' + sel);
  };

  return bh.templates.completion();
};
