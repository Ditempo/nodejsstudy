var express =require("express");
var http =require("http");
var path =require("path");
var bodyParser =require("body-parser");
var mysql =require("mysql");
var app =express();
var port =1222;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var pool =mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : '',
    port : '3306',
    database : 'login'
});


var adduser=function(id,password,name,age,callback){
    console.log("in adduser\n");

    pool.getConnection(function(err,connection){
        if(err){
            connection.release();
            return;
        }

        var data={id:id,password:password,name:name,age:age};


        var exec=connection.query('INSERT into login set ?', data, function(err,result){
            connection.release();

            console.log("실행 대상: "+exec.sql);

            if(err){
                console.log("err : "+err);
                callback(err,null);
                return;
           }
           
           callback(null,result);
        });
    });
}
var authuser=function(id,password,callback){
    console.log("in authuser");

    pool.getConnection(function(err,connection){

        if(err){
            connection.release();
            return;
        }
        
        var colums=["id","name","age"];

        var exec=connection.query("SELECT ?? from login where  id =? and password =?",[colums,id,password],function(err,rows){
            connection.release();
            console.log("실행 대상 : "+exec.sql);
            console.log(rows);
            if(rows.length > 0){

                console.log("일치하는 사용자 존재 [%s]",id);
                callback(null,rows);
            }else{
                console.log("일치하는 사용자 ㄴㄴ [%s]",id);
                callback(null,null);
            }
        });   
    });
}
app.get('/register',function(req,res){
    res.sendfile(__dirname+"/public/register.html");
});
app.post('/register',function(req,res){
    console.log("in register\n");

    var paramId=req.body.id;
    var paramPassword=req.body.password;
    var paramName=req.body.name;
    var paramAge=req.body.age;
    if(pool){
        adduser(paramId,paramPassword,paramName,paramAge,function(err,result){
            if(err){
                throw err;
            }
            if(result){
                console.dir(result);

                console.log('inserted '+result.affectedRows+'rows');
                console.log("사용자추가 성공\n");
                res.send(paramId+":"+paramPassword+":"+paramName+":"+paramAge);
                //로그인페이지로 이동
            }
            else{
                console.log("사용자추가 실패\n");
                //실패 알람 띠우기
                alert("fail");
                res.redirect("/register");
            }
        });
    }else{
        console.log("데이터베이스 연결실패\n");
        //실패 알람 띠우기
        alert("fail");
        res.redirect("/register");
    }
});
app.get('/login',function(req,res){
    res.sendfile(__dirname+"/public/login.html");
});
app.post('/login',function(req,res){
    console.log('in login');

    var paramId=req.body.id;
    var paramPassword=req.body.password;

    if(pool){
        authuser(paramId,paramPassword,function(err,rows){
            if(err){
                throw err;
            }
            if(rows){
                console.log("로그인성공");
                console.dir(rows);
                
                var username=rows[0].name;
                console.log(username);
                res.render('welcomeLoginuser',{username:username});
            }
            else{
                console.log("로그인싪패");
                alert("로그인실패");
                res.redirect('/login');
            }
        });
    }
});
app.get('/onlist',function(req,res){
    
});
var server=app.listen(port,function(){
    console.log("connet");
});