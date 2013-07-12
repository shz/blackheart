bh.hashData = function(data) {
  var hash = '';
  var words = CryptoJS.SHA1(JSON.stringify(data)).words;
  for (var i=0; i<words.length; i++) {
    var n = words[i];
    if (n < 0)
      n = 0xFFFFFFFF + n + 1;
    n = n.toString(16);
    while (n.length < 8)
      n = '0' + n;
    hash += n;
  }
  console.log(data);
  return hash;
};

bh.calcTimes = function(data) {
  var count = 0;
  var avg = 0;
  var ret = {average: 0, times: []};
  for (var i in data) if (data.hasOwnProperty(i)) {
    count++;
    var t = 6 - Math.max(0, Math.min(6, data[i].time / 1000));
    avg += t;
    ret.times.push(t);
  }
  ret.average = avg / count;
  return ret;
};
