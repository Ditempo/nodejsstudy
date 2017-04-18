var http=require('http');
var fs= require('fs');
var express=require('express');
var path=require('path');
var fs=require('fs');
var bodyParser=require('body-parser');
var expressErrorHandler= require('express-error-handler');
var cookieParser=require('cookie-parser');
var expressSession=require('express-session');
var ejs = require('ejs');
var app= express();

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var port= 1222;
var host='10.156.145.122';

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname,'public')));

app.use(cookieParser());
app.use(expressSession({
  secret:'my key',
  resave: true,
  saveUninitialized:true
}));
app.get('/process/product',function(req,res){
  console.log('/process/product 호출');


  if(req.session.user){
    res.redirect('/public/product.html');
  }else{
    res.redirect('/public/login.html');
  }
});

app.post('/process/login',function(req, res, next){
  console.log('first middleware');
/*
  var paramId= req.params.id;
  var paramPassword= req.params.password;
*/
  var paramId=req.param('id');
  var paramPassword=req.param('password');

  if(req.session.user){
    console.log('이미 로그인되어 상품페이지로 이동합니다');

    res.redirect('/public/product.html');
  }else{
    req.session.user={
      id: paramId,
      name: '소녀시대',
      authorized: true
    };
  }
  res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
  res.write('<h1>응답결과</h1>');
  res.write('<div><p>param Id: '+paramId+'</p></div>');
  res.write('<div><p>param Password: '+paramPassword+'</p></div>');
  res.write('<div><a href="/process/product">상품페이지로 이동합니다</a></div>');
  res.end();

  next();
});
app.get('/process/logout',function(req,res){
  console.log('/process/logout 호출');

  if(req.session.user){
    console.log('로그아웃');

    req.session.destroy(function(err){
      if(err){throw err;}

        console.log('세션을 삭제하고 로그아웃');
        res.redirect('/public/login.html');
    });
  }else{
    console.log('아직 로그인되어있지 않습니다.');

    res.redirect('/public/logni.html');
  }
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
app.get('/process/showCookie',function(req, res){
  console.log('/process/showCookie호출');

  res.send(req.cookies);
});
app.get('/process/setUserCookie',function(req,res){
  console.log('/process/setUserCookie호출');

  res.cookie('user',{
    id: 'mike',
    name: '소녀시대',
    authorized:true
  });

  res.redirect('/process/showCookie');
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);
/*
app.all('*',function(req,res){
  res.send(404,'<h1>ERROR-404</h1>');
});
*/
var Server=app.listen(port,host,function(){
  console.log("server start : http://"+host+':'+port);
});
