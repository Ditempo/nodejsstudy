var express=require("express");
var http=require("http");
var path=require('path');
var bodyParser=require('body-parser');
var cookieParser=require('cookie-parser');
var expressSession=require('express-session');
var ejs=require('ejs-locals');

var app=express();

var port=1222;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use('/public',express.static(path.join(__dirname,'public')));

app.use(bodyParser.urlencoded({extended:true}));

app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized:true
}));

var mongodb=require('mongodb');
var mongoose=require('mongoose');
var database;
var UserSchema;
var UserModel;
function connectDB(){
    var databaseUrl='mongodb://localhost:27017/shopping';
    
    mongoose.connect(databaseUrl);
    database=mongoose.connection;

    database.on('error',console.error.bind(console, 'mongoose connection error'));
    database.on('open',function(){
        console.log('데이터베이스에 연결되었습니다. : '+databaseUrl);

        UserSchema=mongoose.Schema({
            id: {type:String,required:true,unique:true},
            name: {type: String,index:'hashed'},
            password: {type: String,required:true},
            age: {type: Number,'default':-1},
            created_at: {type: Date,index:{unique:false},'default':Date.now},
            updated_at: {type: Date,index:{unique:false},'default':Date.now}
        });

        UserSchema.static('findById',function(id,callback){
            console.log('IN FINDBYID');
            return this.find({id:id,callback});
        });

        UserSchema.static('findAll',function(callback){
            return this.find({ },callback);
        });

        console.log('UserSchema 정의함');

        UserModel=mongoose.model("users",UserSchema);
        console.log('user 정의함');
    });
    database.on('disconneted',connectDB);
}

var authUser=function(database,id,password,callback){
    console.log('in authUser');

    UserModel.findById(id,function(err,results){
        if(err){
            callback(err,null);
            return;
        }

        console.log('아이디 [%s]로 겁색',id);
        console.dir(results);

        if(results.length>0){
            console.log('아이디와 일치하는 사용자 찾음');

            if(results[0]._doc.password==password){
                console.log('비밀번호 일치');
                callback(null,results);
            }else{
                console.log('비밀번호 일치 하지 않음');
                callback(null,null);
            }
        }else{
            console.log('아이디와 일치하는 사용자를 찾지 못함');
            callback(null,null);
        }

    });
}

var addUser=function(database,id,password,name,callback){
    console.log('in addUser');

    var user=new UserModel({'id':id,'password':password,'name':name});

    user.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        console.log('사용자를 데이터에 추가함');
        callback(null,user);
    });
}
app.get('/login',function(req,res){
    res.sendfile(__dirname+"/public/m_login.html");
});
app.post('/login',function(req,res){
    console.log('/login 호출됨');
    
    var paramId=req.body.id;
    var paramPassword=req.body.password;

    if(database){
        authUser(database,paramId,paramPassword,function(err,docs){
            if(err){throw err;}
            if(docs){
                console.log('로그인성공');
                // console.dir(docs);
                console.log(docs);
                console.log(docs.name);
                res.send(paramId+docs.name);
            }else{
                console.log('로그인실패');
                res.send('loginfail');
            }
        });
    }else{
        console.log('데이터베이스 연결실패');
        res.send('데이터베이스 연결실패');
    }
});

app.get('/register',function(req,res){
    res.sendfile(__dirname+'/public/m_register.html');
})
app.post('/register',function(req,res){
    console.log('in register post');
    
    var paramId=req.body.id;
    var paramPassword=req.body.password;
    var paramName=req.body.username;

    if(database){
        addUser(database,paramId,paramPassword,paramName,function(err,results){
            if(err){throw err;}

            if(results){
                console.log("사용자 추가 성공");
                console.dir(results);
                res.send('사용자 추가 성공');
            }else{
                console.log('사용자 추가 실패');
                res.send('사용자 추가 실패');
            }
        });
    }else{
        console.log('데이터베이스 연결실패');
        res.send('데이터베이스 연결 실패');
    }
})

app.get('/userList',function(req,res){
    res.sendfile(__dirname+'/public/userList.html');
})
app.post('/userList',function(req,res){
    console.log('in userList');

    if(database){
        
        UserModel.findAll( function(err,results){
            if(err){
                callback(err,null);
                return;
                // console.error(err);
            }
            
            if(results){
                console.dir(results);

                // res.writeHead('200',{'Content-Type':'text/html:charset=utf8'});
                // res.write('<h1></h1>')
                res.render('userList',{results: results,length:results.length});
            }else{
                res.send('listfail');
            }
        });
    }
})
var server=app.listen(port,function(){
    console.log("server runing");

    connectDB();
})

