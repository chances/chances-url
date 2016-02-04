var fs = require('fs');
var fileExists = require('file-exists');
var mkdirp = require('mkdirp');

var csv = require('csv');

function write(data) {
  csv.stringify(data, function(err, output){
    fs.writeFileSync('/home/www/.config/url.csv', output, 'utf8');
  });
}

module.exports = {
  load: function (callback) {
    if (fileExists('/home/www/.config/url.csv')) {
      var data = fs.readFileSync('/home/www/.config/url.csv', {encoding: 'utf8'});
      csv.parse(data, function(err, data) {
        callback(data);
      });
    } else {
      mkdirp.sync('/home/www/.config');
    }
  },
  save: function(db) {
    write(db);
  }
};
