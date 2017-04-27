var express=require("express");
var http=require("http");
var path=require('path');
var bodyParser=require('body-parser');
var cookieParser=require('cookie-parser');
var expressSession=require('express-session');
var ejs=require('ejs-locals');
var mongodb=require('mongodb');
var mongoose=require('mongoose');
var passport=require("passport");
var flash=require('connect-flash');
var LocalStrategy=require('passport-local').Strategy;

var app=express();

// var config=require('./mongodbLogin_Config');
// console.log('config.server_port : %d',config.server_port);
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

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

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

        UserSchema=require(__dirname+'/mongodbLogin_UserSchema.js').createSchema(mongoose);
        UserModel=mongoose.model("users",UserSchema);
        
        console.log('user 정의함');
    });
    database.on('disconneted',connectDB);
}

// passport.serializeUser(function(user, done){
//     console.log('serializeUser() 호출됨');
//     console.dir(user);

//     done(null,user);
// });
// passport.deserializeUser(function(user,done){
//     console.log('deserializeUser() 호출됨');
//     console.dir(user);

//     done(null,user);
// });
// passport.use('local-login',new LocalStrategy({
//     usernameField : 'email',
//     passwordField : 'password',
//     passReqToCallback : true
//     },function(req,id,password,done){
//         console.log('passport의 local-login 호출됨 : '+id+','+password);
//         var database= app.get('database');
//         database.UserModel.findOne({'email':email},function(err,user){
//         if(err){return done(err);}
//         if(!user){
//             console.log('계정이 일치하지 않음');
//             return done(null,false,req.flash('loginMessage','등록된 계정이 없습니다'));
//         }

//         var authenticated= user.authenticate(password, user._doc.password);

//         if(!authenticated){
//             console.log('비밀번호가 일치 하지 않음');
//             return done(null,false, req.flash('loginMessage','비밀번호가 일치하지 않습니다'));
//         }
//         console.log('계정과 비밀번호가 일치함');
//         return done(null,user);
//     });
// }));
// passport.use('login-signup',new LocalStrategy({
//     usernameField: 'email',
//     passwordField : 'password',
//     passReqToCallback : true
//     },function(req,email,password,done){
//         var paramName=req.body.name;
//         console.log('passport의 local-signup 호출됨 : ' +email+','+password+','+paramName);

//         process.nextTick(function(){
//             var database=app.get('database');
//             database.UserModel.findOne({'email':email},function(err,user){
//                 if(err){return done(err);}
//                 if(user){
//                     console.log('기존에 계정이 있음');
//                     return done(null,false,req.flash('signupMessage','계정이 이미 있습니다'));
//                 }else{
//                     var user=new database.UserModel({'email':email,'password':password,'name':paramName});
//                     user.save(function(err){
//                         if(err){throw err;}
//                         console.log('사용자 데이터 추가함');
//                         return done(null,user);
//                     });
//                 }
//             });
//         });
// }));
// function isLoggedIn(req,res,next){
//     console.log('isLoggedIn 미들웨어 호출됨');

//     if(req.isAuthenticated()){
//         return next();
        
//     }
//     res.redirect('/');
// }
var authUser=function(database,id,password,callback){
    console.log('in authUser');

    UserModel.findById(id,function(err,results){
        if(err){
            callback(err,null);
            return;
        }

        console.log('아이디 [%s]로 겁색',id);
        console.log(results);

        if(results){
            console.log('아이디와 일치하는 사용자 찾음');

            if(results.password==password){
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

var addUser=function(database,id,password,name,email,callback){
    console.log('in addUser');

    var user=new UserModel({'id':id,'password':password,'name':name,'email':email});

    user.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        console.log('사용자를 데이터에 추가함');
        callback(null,user);
    });
}
var listuser=function(callback){
    console.log('in listuser');
    

    UserModel.findAll(function(err,results){
        console.log("listuser in findall");
        if(err){
            console.error(err);
            callback(err,null);
            return;
        }
        if(results){
            console.dir(results);
            callback(null,results);
            return;
        }

       console.log("null");
       callback(null,null); 
    });
}

// route_loader.init(app);

// app.get('/',function(req,res){
//     console.log('/패스');
//     res.render('index',{});
// })

// app.get('/login',function(req,res){
//     // res.sendfile(__dirname+"/public/m_login.html");
//     res.render('login',{message : req.flash('loginMessage')});
// }).post('/login',passport.authenticate('local-login',{
//     successRedirect : '/profile',
//     failureRedirect : '/login',
//     failureFlash : true
// }));
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

// app.get('/logout',function(req,res){
//     console.log('/logout 패스 요청됨');
//     req.logOut();
//     res.redirect('/');
// });
// app.get('/signup',function(req,res){
//     console.log('/signup 패스 요청됨');
//     res.render('signup',{message : req.flash('signupMessage')});
// });
// app.post('/signup',passport.authenticate('local-signup',{
//     successRedirect : 'profile',
//     failureRedirect : '/signup',
//     failureFlash : true
// }));
app.get('/register',function(req,res){
    res.sendfile(__dirname+'/public/m_register.html');
})
app.post('/register',function(req,res){
    console.log('in register post');
    
    var paramId=req.body.id;
    var paramPassword=req.body.password;
    var paramName=req.body.username;
    var paramEmail=req.body.email;
    if(database){
        addUser(database,paramId,paramPassword,paramName,paramEmail,function(err,results){
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
// app.get('/profile',isLoggedIn,function(req,res){
//     console.lof('/profile 패스 요청됨');
//     console.dir(req,user);

//     if(Array.isArray(req.user)){
//         res.render('profile.ejs',{user : req.user[0]._doc});
//     }else{
//         res.render('profile.ejs',{user:req.user});
//     }
// });
app.get('/userList',function(req,res){
    res.sendfile(__dirname+'/public/userList.html');
})
app.post('/userList',function(req,res){
    console.log('in userList');

    if(database){
        
        listuser(function(err,results){

            if(err){throw err;}

            if(results){
                console.dir(results);    
                res.render('userList',{results: results,length:results.length});
            }else{
                res.send('listfail');
            }
        });
    }else{
        console.log('데이터베이스 연결실패');
        res.send('데이터베이스 연결 실패');
    }
})
var server=app.listen(port,function(){
    console.log("server runing");

    connectDB();
})

