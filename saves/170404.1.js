var express=require('express');
var http=require('http');
var path=require('path');
var bodyParser= require('body-parser');
var cookieParser=require('cookie-parser');
var expressSession=require('express-session')

var app=express();
var port=1222;

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({extended: true}));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(cookieParser());
app.use(expressSession({
  secret:'my key',
  resave:true,
  saveUninitialized:true
}));

var mysql=require('mysql');
var pool=mysql.createPool({
    connectionLimit : 10,
    host : 'localhost',
    user : 'root',
    password : '123456',
    database: 'test',
    debug : false
});

var user={
    id:'aaa',
    name:'gsw',
    age:'17',
    password:'1111'
}
var addUser=function(id,name,age,password,callback){
    console.log('adduser 호출됨');
    pool.getConnection(function(err, connection){
        if(err){
            connection.release();
            return;
        }
        console.log('데이터베이스 연결 스레드 아이디 : '+connection.threadId);
        var data={
            id:id,
            name:name,
            age:age,
            password:password
        };

        var exec=connection.query('insert into users set ?',data,function(err,result){
            console.log('실행 대상 SQL : '+exec.sql);
            conn.release();

            if(err){
                console.log('SQL 실행 오류 : /n');
                console.dir(err);

                callback(err,null);

                return;
            }
            callback(null,result);
        });
    })
}

app.get('/login',function(req,res){
  console.log('get login');
  res.sendFile(__dirname+'/public/login.html');

})
app.post('/login',function(req,res){
  console.log('post login');
  var id=req.body.username;
  var pwd=req.body.password;
  console.log({ID : id ,Password : pwd});
  res.redirec('/welcome');
});

app.get('/logout',function(req,res){
  delete req.session.displayname;
  req.session.save(function(){
    res.redirect('/welcome');
  });
});

app.get('/register',function(req,res){
  console.log('get register');
  res.sendFile(__dirname+'/public/register.html');
});
app.post('/register',function(req,res){
  console.log('post register');

  // var paramId=req.param('id');
  // var paramName=req.param('name');
  // var parmaAge=req.param('age');
  // var paramPassword=req.param('password');

  var paramId=req.body.username;
  var paramName=req.body.name;
  var paramAge=req.body.age;
  var paramPassword=req.body.password;

    if(pool){
        addUser(paramId,paramName,paramAge,paramPassword,function(err,result){
            if(err){throw err;}
            if(result){
                console.dir(result);

                console.log('inserted '+result.affectedRows+' rows');

                var insertId=result.insertId;
                console.log('추가한 레코드의 아이디 : '+insertId);
                console.log('추가성공');
            } else {
                console.log('추가 실패');
            }
        });
    } else {
        console.log('db 연결 실패');
    }
    res.redirect('/welcome');
})
app.get('/welcome',function(req,res){
  console.log('welcome');
  res.send('welcome');
})
app.listen(port,function(){
  console.log('http://localhost:'+port);
});
