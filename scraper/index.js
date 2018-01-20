var Flickr = require("node-flickr");
var keys = {"api_key": process.argv[2]};
flickr = new Flickr(keys);
var request = require('request');
var fs = require('fs');

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

function process(i) {
  flickr.get("photos.search", {"tags":"city,landscape,portrait", "sort":"interestingness-desc", "per_page":500, "page": i}, function(err, result){
      console.log("Processing page" + i)
      if (err) return console.error(err);

      downloadNext(i, result.photos, 0);
  });
}

function downloadNext(i, photos, j) {
  if (j >= photos.length - 1) process(i + 1);

  photo = photos.photo[j];
  url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_"  + photo.secret + "_n.jpg";
  download(url, "img/" + j + ".jpg", function() {
    downloadNext(i, photos, j + 1);
  });
}

process(0);
