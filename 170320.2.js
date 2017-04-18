var http=require('http');
var path=require('path');
var html = require('html');
var express=require('express');
var bodyParser=require('body-parser');
var app=express();

var port=1222;
var host='10.156.145.122';

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'public')));

app.post('/mamo', function(req, res) {
//  res.render('../public/mamo.html');

  var title=req.body.name;
  var text=req.body.text;

  res.send('제목: '+title+'내용: '+text);
});

var Server=app.listen(port, host, function(){
  console.log('server start : http://'+host+':'+port);
});
