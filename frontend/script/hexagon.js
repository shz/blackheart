bh.hexagon = function(hash) {

  // Random hash if none passed in
  if (!hash) {
    hash = '';
    for (var i=0; i<40; i++)
      hash += '0123456789abcdef'.charAt((Math.random() * 16)|0);
  }

  // The root element we're going to use
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.WebkitTransform = 'rotate(45deg)';

  // Util function for creating an SVG element
  var make = function(t, attr) {
    var el = document.createElementNS(svg.namespaceURI, t);
    for (var i in attr) if (attr.hasOwnProperty(i))
      el.setAttribute(i, attr[i]);
    return el;
  };

  // Layout properties
  var edgeCount = 5;
  var triangleWidth = 97;
  var trianglePadding = 0;
  var colorPoints = 4; // Max 8 and (40 / colorPoints) must be a multiple of 5

  // Calculated layout properties
  var triangleHeight = Math.sqrt(
    -Math.pow(triangleWidth / 2, 2) + Math.pow(triangleWidth, 2)
  );
  var sectionWidth = (edgeCount * triangleWidth) + ((edgeCount - 1) * (trianglePadding * 2));
  var sectionHeight = (edgeCount * triangleHeight) + ((edgeCount - 1) * trianglePadding);
  var charsPerColorPoint = 40 / colorPoints;

  // Convert the hash into a fixed number of integer points.
  // We need 5 points per color point.
  var hashParts = [];
  var hashStride = (40 / colorPoints) / 5;
  for (var i=0; i < colorPoints * 5; i++)
    hashParts.push(parseInt(hash.substr(i * hashStride, hashStride), 16) / (Math.pow(16, hashStride) - 1));

  // Set proper SVG size
  svg.style.width = ((2 * sectionWidth)|0) + 'px';
  svg.style.height = ((2 * sectionHeight)|0) + 'px';
  svg.style.WebkitTransform = 'scale(0.5)';

  // Color positions
  var colorPositions = [];
  var r = function(i, k) {
    // return Math.random();
    return hashParts[i*colorPoints + k];
  };
  for (var i=0; i<colorPoints; i++) {
    colorPositions.push([
      r(i, 0),
      r(i, 1),
      [r(i, 2) * 0.8 + 0.2, r(i, 3) * 0.8 + 0.2, r(i, 4) * 0.8 + 0.2]
    ]);
  }

  // Color state machine, tracks absolute position
  var color = {
    rot: 0,
    getColor: function(x, y) {
      // Normalize inside section
      x = x / (sectionWidth - triangleWidth - trianglePadding);
      y = y / (sectionHeight - triangleHeight - trianglePadding);

      // Adjust coordinate from upper-left to lower-mid
      x = x - 0.5;
      y = 1 - y;

      // Convert to polar
      var d = Math.sqrt(x*x + y*y);
      var r = Math.atan(x / y) || 0;

      // Convert local polar to global polar
      r += (color.rot / 360) * (Math.PI * 2);

      // console.log(r, d);

      // Convert back from polar to cartesian
      x = Math.sin(r) * d;
      y = Math.cos(r) * d;

      // // Normalize from (-1, 1) to (0, 1)
      x = (x + 1) / 2;
      y = (y + 1) / 2;

      // Now that we have absolute positioning, we base our color
      // off of the total distance from the defined colors
      var finalColor = [0, 0, 0];
      var distances = [];
      for (var i=0; i<colorPositions.length; i++) {
        var dx = colorPositions[i][0] - x;
        var dy = colorPositions[i][1] - y;
        var dt = Math.sqrt(dx*dx + dy*dy);
        distances.push(dt);
      }
      for (var i=0; i<distances.length; i++) {
        for (var p=0; p<3; p++) {
          finalColor[p] += Math.pow(1 - distances[i], 3) * colorPositions[i][2][p];
        }
      }

      return 'rgb(' + ((finalColor[0] * 255)|0)
           + ', ' + ((finalColor[1] * 255)|0)
           + ', ' + ((finalColor[2] * 255)|0)
           + ')';

      // Somewhat less lame version
      return 'rgb(0, ' + ((255 * Math.abs(x))|0) + ',' + ((255 * Math.abs(y))|0) + ')';
    }
  };

  // Fills out a section
  var fillSection = function(r, c, x, y) {

    // Do a single row
    for (var i=0; i<c; i++) {
      // Triangle top-left point
      var tx = x + (i * trianglePadding * 2) + (i * triangleWidth);

      // Make bottom-pointing triangle
      var points = [
        [tx, y].join(','),
        [tx + triangleWidth, y].join(','),
        [tx + triangleWidth / 2, y + triangleHeight].join(',')
      ];
      r.appendChild(make('polygon', {
        'fill': color.getColor(tx, y),
        'points': points.join(' ')
      }));

      // Make top-pointing triangle
      if (i > 0) {
        points = [
          [tx - trianglePadding, y].join(','),
          [tx + triangleWidth / 2 - trianglePadding, y + triangleHeight].join(','),
          [tx - triangleWidth / 2 - trianglePadding, y + triangleHeight].join(',')
        ];
        r.appendChild(make('polygon', {
          'fill': color.getColor(tx + triangleWidth / 2, y + triangleHeight / 2),
          'points': points.join(' ')
        }));
      }
    }

    // Keep recursing down if there was more than 1 triangle to draw
    if (c > 1) {
      fillSection(r, c-1,
        x + (triangleWidth / 2) + (trianglePadding),
        y + triangleHeight + trianglePadding
      );
    }
  };

  // Build in sections
  for (var i=0; i<6; i++) {

    // Update the color SM's rotation info
    color.rot = i * 60;

    // Root section element
    var section = make('g', {
      'class': 'section',
      'transform': 'translate(' + sectionWidth + ', ' + sectionHeight + ') '
                 + 'rotate(' + (i * 60) + ')'
                 + 'translate(' + (sectionWidth / -2) + ', -' + (sectionHeight + trianglePadding) + ')'
                 ,
      'width': sectionWidth,
      'height': sectionHeight
    });
    svg.appendChild(section);

    // Fill out the interior triangles
    fillSection(section, edgeCount, 0, 0);
  }

  return svg;
};
