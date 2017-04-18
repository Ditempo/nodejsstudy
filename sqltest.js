var http=require('http');
var path=require('path');
var html = require('html');
var express=require('express');
var bodyParser=require('body-parser');
var cookieParser=require('cookie-parser');
var expressSession=require('express-session');
var expressErrorHandler=require('express-error-handler');
var jade=require('jade');
var mysql=require('mysql');
var app=express();

var port=1222;
var host='10.156.145.122';

var pool=mysql.createPool({
  connectionLimit : 10,
  host : host,
  user : 'root',
  password : '000000',
  database : 'test',
  debug : false
});

//ejs
/*
app.engine('ejs',engine);
app.set('view engine','ejs');
app.set('views',__dirname+'/views');
*/
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


//사용자 인증
var authUser=function(database, id, password, callback){
  console.log('authUser 호출');

  var users=database.collection('users');

  users.find({'id':id,'password':password}).toArray(function(err, docs){
    if(err){
      callback(err, null);
      return;
    }

    if(docs.length>0){
      console.log('아이디 [%s], 비밀번호 [%s]가 일치하는 사용자 찾음.',id,password);;
      callback(null,docs);
    }else{
      console.log('일치하는 사용자를 찾지못함');
      callback(null,null);
    }
  });
}

app.post('/process/login',function(req,res){
  console.log('/process/login 호출됨');

  var paramId=req.param('id');
  var paramPassword=req.param('password');

  if(database){
    authUser(database, paramId, paramPassword,function(err, docs){
      if(err) {throw err;}

      if(docs){
        console.log(docs);

        res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
        res.write('<h1>로그인성공</h1>');
        res.write('<div><p>사용자 아이디 : '+paramId+'</p></div>');
        res.write('<div><p>사용자 이름 : '+username+'</p></div>');
        res.write('<br><a href="/public/login.html">다시로그인</a>');
      }else{
        res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
        res.write('<h1>로그인실패</h1>');
        res.write('<div><p>아이디와 비밀번호를 다시 확인하십시오.</p></div>');
        res.write('<br><a href="/public/login.html">다시로그인</a>');
      }
    });
  }else{
    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>DB연결실패</h1>');
    res.end();
  }
});

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

});
