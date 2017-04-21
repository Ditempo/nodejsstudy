//require
var express=require('express');
var http=require('http');
var path=require('path');
var bodyParser=require('body-parser');
var cookieParser=require('cookie-parser');
var expressSession=require('express-session');
var expressErrorHandler=require('express-error-handler');
var app=express();

var port=1222;
var host='10.156.145.122';
//public폴더변경
app.use('/public',express.static(path.join(__dirname,'public')));
//body-parser,cookie-parser,express-session사용설정
app.use(bodyParser.urlencoded({extended:true}));

app.use(cookieParser());
app.use(expressSession({
  secret:'my key',
  resave:true,
  saveUninitialized:true
}));

//404오류페이지
var errorHandler=expressErrorHandler({
  static:{
    '404': './public/404.html'
  }
});
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

//server객체 생성
var server=app.listen(port,host,function(){
  console.log('server start http://'+host+":"+port);
})
