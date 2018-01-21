var fs = require('fs');
var max = 499;
var baseImg = "img";
var outputImg = "processedeval"
var jimp = require('jimp');

var output = "";
var imCount = 0;

function generateLine(i, j, r, h, s, b, c) {
  return ((i * 5) + j) + "\t" + r + "\t" + h + "\t" + s + "\t" + b + "\t" + c + "\t" + outputImg + "/" + i + "_" + j + ".jpg";
}

var i = 0;
var j = 0;

function processNext() {
  if (i < max) {
    if (j < 5) {
      var r = generateTrainingItem(i, j, function() { processNext(); });
      output += generateLine(i, j, r.rotate, r.hue, r.saturation, r.brightness, r.contrast);

      fs.writeFile("outputeval.lst", output, function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("File saved");
      });

      j++;
    } else {
      j = 0;
      i++;
      processNext();
    }
  } else {
    fs.writeFile("outputeval.lst", output, function(err) {
      if(err) {
          return console.log(err);
      }

      console.log("File saved");
    });
  }
}

function process() {
  processNext();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getCropCoordinates(angleInRadians, imageDimensions) {
    var ang = angleInRadians;
    var img = imageDimensions;

    var quadrant = Math.floor(ang / (Math.PI / 2)) & 3;
    var sign_alpha = (quadrant & 1) === 0 ? ang : Math.PI - ang;
    var alpha = (sign_alpha % Math.PI + Math.PI) % Math.PI;

    var bb = {
        w: img.w * Math.cos(alpha) + img.h * Math.sin(alpha),
        h: img.w * Math.sin(alpha) + img.h * Math.cos(alpha)
    };

    var gamma = img.w < img.h ? Math.atan2(bb.w, bb.h) : Math.atan2(bb.h, bb.w);

    var delta = Math.PI - alpha - gamma;

    var length = img.w < img.h ? img.h : img.w;
    var d = length * Math.cos(alpha);
    var a = d * Math.sin(alpha) / Math.sin(delta);

    var y = a * Math.cos(gamma);
    var x = y * Math.tan(gamma);

    return {
        x: x,
        y: y,
        w: bb.w - 2 * x,
        h: bb.h - 2 * y
    };
}

function rotate(image, angle) {
  var rAngle = angle * (Math.PI / 180);
  var c = getCropCoordinates(rAngle, { w: 360, h: 360 });
  return image.resize(360, 360)
      .rotate(angle)
      .crop(c.x, c.y, c.w, c.h)
      .resize(256, 256)
      .quality(60);
}

function generateTrainingItem(i, j, cb) {
  var rRotate = getRandomInt(72) * 5;
  var aRotate = 360 - rRotate;

  var hue = getRandomInt(20) - 10;
  var aHue = -hue;

  var saturation = (getRandomInt(40) * 5) - 100;
  var aSaturation = -saturation;

  var brightness = ((getRandomInt(40) * 5) - 100) / 200;
  var aBrightness = -brightness;

  var contrast = ((getRandomInt(40) * 5) - 100) / 200;
  var aContrast = -contrast;

  jimp.read(baseImg+ "/" + i + ".jpg", function(err, img) {
    if (err) console.log(err);

    img = rotate(img, rRotate);
    if (saturation < 0) {
      img = img.color([
        { apply: 'hue', params: [ hue ] },
        { apply: 'desaturate', params: [ saturation ]}
      ]);
    } else {
      img = img.color([
        { apply: 'hue', params: [ hue ] },
        { apply: 'saturate', params: [ saturation ]}
      ]);
    }
    img.brightness(brightness).contrast(contrast).write(outputImg + "/" + i + "_" + j + ".jpg");
    cb();
  });

  return {
    rotate: aRotate / 360,
    hue: (aHue / 360) + 0.5,
    saturation: (aSaturation / 200) + 0.5,
    brightness: (aBrightness / 2) + 0.5,
    contrast: (aContrast / 2) + 0.5
   }
}

process();
