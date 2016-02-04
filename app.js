var urlDb = require('./db');

var bodyParser = require('body-parser');
var express = require('express');
var app = express();

var db = [];

urlDb.load(function (data) {
  db = data;
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/*', function (req, res) {
  var link = req.path.substring(1),
      linkExists = false;

  if (link === 'create') {
    res.render('create', { db: db });
  } else {

    var output = '';

    for (var i = 0; i < db.length; i += 1) {
      var alias = db[i][0],
          url = db[i][1];
      output += alias + '\n';
      if (link === alias) {
        res.redirect(302, url);
        linkExists = true;
      }
    }

    if (!linkExists) {
      // Alias doesn't exist, redirect to chancesnow.me
      res.redirect(302, 'http://chancesnow.me');
    }
  }
});

app.post('/create', function (req, res) {
  var alias = req.body.alias;
  var url = req.body.url;

  if (alias !== undefined && url !== undefined) {
    db.push([alias, url]);
    urlDb.save(db);
    res.render('create', { db: db });
  } else {
    res.status(400).send('400: Bad Request');
  }
});

app.listen(8080, function () {
  console.log('URL app listening on port 8080');
});
