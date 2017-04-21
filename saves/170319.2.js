var http=require('http');
var fs= require('fs');
var express=require('express');
var path=require('path');
var fs=require('fs');
var bodyParser=require('body-parser');
var expressErrorHandler= require('express-error-handler');
var ejs = require('ejs');
var app= express();


app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var port= 1222;
var host='10.156.145.122';

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname,'public')));

app.post('/process/login',function(req, res, next){
  console.log('first middleware');
/*
  var paramId= req.params.id;
  var paramPassword= req.params.password;
*/
  var paramId=req.param('id');
  var paramPassword=req.param('password');

  res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
  res.write('<h1>응답결과</h1>');
  res.write('<div><p>param Id: '+paramId+'</p></div>');
  res.write('<div><p>param Password: '+paramPassword+'</p></div>');
  res.write('<div><a href="/login.html">로그아웃</a></div>');
  res.end();

  next();
});

app.get('/process/users/:id',function(req,res){

  var paramId=req.params.id;

  console.log('/process/users 와 토큰 %s를 사용해 처리',paramId);

  res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
  res.write('<h1>서버에서 응답한 결과입니다</h1>');
  res.write('<div><p>param id:'+paramId+'</p></div>');

  res.end();
});

var errorHandler= expressErrorHandler({
  static: {
    '404': './public/404.html'
  }
});
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);
/*
app.all('*',function(req,res){
  res.send(404,'<h1>ERROR-404</h1>');
});
*/
var Server=app.listen(port,host,function(){
  console.log("server start : port"+host+' :'+port);
});
