var path = require("path");
port = process.env.PORT || 3000;
const hostname = '127.0.0.1';
var express = require('express');
var app = express();

app.use(express.static('public'))

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.get('/phones', function(req, res) {
  const phoneData = require('./products.json');
  const responce = phoneData;
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  console.log("API call");
  res.send(responce);
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname+'/public/index.html')));
