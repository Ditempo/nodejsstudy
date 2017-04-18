const http = require('http');
const hostname = '10.156.145.122';
const port = 1222;
var express = require('express');
var path=require("path");
var bodyParser=require("body-Parser");
var app = express();

app.use(express.static(__dirname+'/public'));

app.get('/clock',function(req, res){
 
  res.sendfile(__dirname+"/public/clock.html");
});

var server=app.listen(port, hostname, function(){
  console.log(`Server running at http://${hostname}:${port}/`);
});
