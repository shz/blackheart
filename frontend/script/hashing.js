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
  var categories = {
    anger: ['irritiation', 'resentment', 'frustration', 'disgust', 'rage', 'torment', 'torment'],
    love: ['compassion', 'affection', 'adoration', 'longing', 'passion', 'lust', 'lust'],
    fear: ['unease', 'nervousness', 'alarm', 'fear', 'panic', 'horror', 'horror'],
    sadness: ['unhappiness', 'dismay', 'shame', 'isolation', 'suffering', 'depression', 'depression'],
    joy: ['optimism', 'contentment', 'cheerfulness', 'zest', 'pleasure', 'ecstasy', 'ecstasy'],
    surprise: ['apprehension', 'tension', 'surprise', 'amazement', 'astonishment', 'shock', 'shock']
  }

  var count = 0;
  var avg = 0;
  var ret = {average: 0, times: [], text: []};
  for (var i in data) if (data.hasOwnProperty(i)) {
    count++;
    var t = 6 - Math.max(0, Math.min(6, data[i].time / 1000));
    t = t + 0.5|0;
    avg += t;
    ret.times.push(t);
    ret.text.push(categories[i.toLowerCase()][t])
  }
  ret.average = avg / count;
  return ret;
};
