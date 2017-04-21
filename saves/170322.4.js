var http=require('http');
var path=require('path');
var express= require('express');
var cookieParser=require('cookie-parser');
var app=express();
var port=1222;
var host='10.156.145.122'
app.use(cookieParser());
app.get('/count',function(req, res){
  if(req.cookies.count){
    var count= parseInt(req.cookies.count);
  } else {
    var count= 0;
  }
  count= count+1;
  res.cookie('count', count);
  res.send('count : '+count);
});
app.listen(port, host, function(){
  console.log('http://'+host+':'+port);
});
