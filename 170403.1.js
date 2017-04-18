var http=require('http');
var path=require('path');
var express=require('express');
var cookieParser=require('cookie-parser');
var bodyParser= require('body-parser');
var ejs=require('ejs');
var mysql=require('mysql');
// var session=require('express-session');
var app=express();
var port=1222;
var pool=mysql.createPool({
    connectionLimit : 10,
    host : 'localhost',
    user : 'root',
    password : '123456',
    database: 'test',
    debug : false
});

app.use(express.static(__dirname,'/public'));
app.use(bodyParser.urlencoded({extended: true}));


app.use(cookieParser());
// app.use(expressSession({
//     secret:'my key',
//     resave: true,
//     saveUninitialized:true
// }));

var user={
    id:'aaa',
    name:'gsw',
    age:'17',
    password:'1111'
}

var addUser=function(id,name,age,password,callback){
    console.log('adduser 호출됨');

    pool.getConnection(function(err, conn){
        if(err){
            conn.release();
            return;
        }
        console.log('데이터베이스 연결 스레드 아이디 : '+conn.threadId);

        var data={
            id:id,
            name:name,
            age:age,
            password:password
        };

        var exec=conn.query('insert into users set ?',data,function(err,result){
            conn.release();
            console.log('실행 대상 SQL : '+exec.sql);

            if(err){
                console.log('SQL 실행 오류 : /n'+err);

                callback(err,null);

                return;
            }
            callback(null,result);
        });

    })
}

app.get('/login',function(req,res){
  console.log('get login');
  res.render('/login.html');
})
app.post('/login',function(req,res){
    var id=req.param('id');
    var pwd=req.param('password');


})
app.get('/logout',function(req,res){
  delete req.session.displayname;
  req.session.save(function(){
    res.redirect('/welcome');
  });
})


app.get('/register',function(req,res){
    res.render('/register.html');
});
app.post('/register',function(req,res){
    console.log('/register');

    var paramId=req.param('id');
    var paramName=req.param('name');
    var parmaAge=req.param('age');
    var paramPassword=req.param('password');

    if(pool){
        addUser(paramId,parmaName,parmaAge,parmaPassword,function(err,result){
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
})
app.listen(port,function(){
  console.log('http://loclalhost:'+port);
});
