var http= require('http');
var express= require('express');
var path= require('path');
var fs= require('fs');

var port=1222;
var host= '127.0.0.1';
var app=express();

app.use(function(req,res,next){
  console.log('첫번째 미들웨어에서 요청처리');

  var userAgent= req.header('User-Agent');
  //var paramName= req.param('name');
  var paramName= req.query.id;

  res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
  res.write('<h1>응답결과</h1>');
  res.write('<div><p>User-Agent: '+userAgent+'</p></div>');
  res.write('<div><p>Param name: '+paramName+'</p></div>');
  res.end();
  //res.redirect('http://google.co.kr');
  next();
});

app.use('/',function(req,res,next){
  console.log('두번째 미들웨어세서 요청처리');

  res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
  res.end('<h1>'+req.user+'응답결과</h1>');

});

var Server= http.createServer(app).listen(port,host,function(){
  console.log(port+"번 포트");
});
