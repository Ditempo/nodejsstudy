var express=require('express');
var http=require('http');
var path=require('path');
var bodyParser=require('body-parser');
var cookieParser=require('cookie-parser');
var expressSession=require('express-session');
//var expressErrorHandler=require('express-error-handler');

var app= express();
var port=1222;

var mongodb=require('mongodb');

var database;
function connectDB(){
  var databaseUrl='mongodb://localhost:27017/shopping';

  mongodb.connect(databaseUrl, function(err,db){
    if(err) throw err;

    console.log('db연결 성공:'+databaseUrl);

    database=db;
  });
};
app.use('/public',express.static(path.join(__dirname,'public')));

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
  })
);

// var errorHandler=expressErrorHandler({
//   static: {
//     '404':'./public/404.html'
//   }
// });

// app.use(expressErrorHandler.httpError(404));
// app.use(errorHandler);

var authUser=function(database, id, password, callback){
  console.log('authUser called');

  var users=database.collection('users');

  users.find({"id":id,"password":password}).toArray(function(err, docs){
    if(err){
      callback(err,null);
      return;
    }
    if(docs.length>0){
      console.log('id: [%s],password: [%s]일치하는 사용자 존재 ',id,pasword);
      callback(null,docs);
    } else {
      console.log("일치하는 사용자를 찾지 못함");
      callback(null,null);
    }
  });
}

app.post('/process/login',function(req,res){
  console.log('/process/login 호출');

  // var paramId=req.param('id');
  // var paramPassword=req.param('password');

  var paramId=req.param.id;
  var paramPassword=req.param.password;
  if(database){
    authUser(database,paramId,paramPassword,function(err,docs){
      if(err){throw err;}

      if(docs){
        console.dir(docs);

        res.writeHead('200',{'Content-Type':'text/html;charset=urf8'});
        res.write('<h1>로그인 성공</h1>');
        res.write('<div><p>id :'+paramId+' </p></div>');
        res.write('<div><p>userid :'+username+' </p></div>');
        res.write('<div><p><a href="/public/login.html">다시로그인하기</a></p></div>');
      } else {
        res.writeHead('200',{'Content-Type':'text/html;charset=urf8'});
        res.write('<h1>로그인 실패</h1>');
        res.write('<div><p>아이디와 비밀번호</p></div>');
        res.write('<div><p><a href="/public/login.html">다시로그인</a> </p></div>');
        res.end();
      }
    });
  }else{
    res.writeHead('200',{'Content-Type':'text/html;charset=urf8'});
    res.write('<h1>데이터베이스 연결 실패</h1>');
    res.write('<div><p>데이터베이스에 연결하지 못했습니다</p></div>');
    res.end();
  }
});

app.listen(port,function(){
  console.log('http://localhost:'+port);

  connectDB();
});
