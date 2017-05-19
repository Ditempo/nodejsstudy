var express= require('express')
    ,http= require('http')
    ,path= require('path');

var bodyParser= require('body-parser')
    ,cookieParser= require('cookie-parser')
    ,static= require('serve-static')
    ,errorHandler= require('errorhandler');

var ejs=require('ejs-locals');

// var userRoute= require(__dirname+'/ReMongodbLoginUser.js');
// var config= require(__dirname+'/ReMongodbLoginConfig.js');
// var database= require(__dirname+'/ReMongodbLoginDatabase');
// var 

var expressErrorHandler= require('express-error-handler')
    ,expressSession= require('express-session');

var MongoClient= require('mongodb').MongoClient
    ,mongoose= require('mongoose')
    ,crypto= require('crypto');

var passport= require('passport')
    ,flash= require('connect-flash');

var app= express();

var router= express.Router();
app.use('/',router);

// console.log('config.server_port : %d',config.server_port);
app.set('port',process.env.PORT || 1222);

// var port=1222;

app.use(bodyParser.urlencoded({extended: false}))
    .use(bodyParser.json());

app.use('/public',static(path.join(__dirname,'public')))
    .set('views', __dirname + '/views')
    .set('view engine', 'ejs')
    .engine('html', require('ejs').renderFile);

app.use(cookieParser());

app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var database
    ,UserSchema
    ,UserModel;

function connectDB(){
    var databaseUrl='mongodb://localhost:27017/shopping/database';

    console.log('데이터베이스 연결을 시도합니다.');
    mongoose.Promise= global.Promise;
    mongoose.connect(databaseUrl);
    database= mongoose.connection;

    database.on('error',console.error.bind(console,'mogoose connection error.'));
    database.on('open',function(){

        console.log('데이터베이스에 연결되었습니다. : '+databaseUrl);

        createUserSchema();
        
        
    });
    database.on('disconnected',function(){
        console.log('연결이 끊어졌습니다. 5초후 다시 연결합니다.');
        setInterval(connectDB,5000);
    });
}

function createUserSchema(){

    UserSchema=require(__dirname+'/ReMongodbLoginUserSchema.js').createSchema(mongoose);
        
    UserModel= mongoose.model("reusers",UserSchema);
    console.log('UserModel 정의함');

    
}

var LocalStrategy= require('passport-local').Strategy;

passport.use('local-login',new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
},function(req, email, password, done){
    console.log('passport의 local-login 호출됨 : '+email+', '+password);

    var database= app.get('database');
    database.UserModel.findOne({'email':email}, function(err, user){
        if(err){return done(err); }
        if(!user){
            console.log('계정이 일치하지 않음');
            return done(null, false, req.flash('loginMessage', '등록된 계정이 없습니다.'));
        }
        var authenticated= user.authenticate(password, user._doc.salt, user._doc.hashed_password);
        if(!authenticated){
            console.log('비밀번호 일치하지 않음.');
            return done(null, false, req.flash('loginMessage'))
        }

        console.log('계정과 비밀번호가 일치함.');
        return done(null, user);
    });
}));
passport.use('local-signup',new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
},function(req, email,password, done){
    var paramName= req.body.name ||req.query.name;
    console.log('passport의 local-signup 호출됨 : '+email+', '+password+', '+paramName);

    process.nextTick(function(){
        var database= app.get('database');
        database.UserModel.findOne({'email' : email}, function(err, user){
            if(err){
                return done(err);
            }
            if(user){
                console.log('기존에 계정이 있음.');
                return done(null, false, req.flash('signupMessage', '계정이 이미 있습니다.'));
            }else{
                var user= new database.UserModel({'email' : email,'password' : password,'name' : paramName});
                user.save(function(err){
                    if(err){throw err;}
                    console.log("사용자 데이터 추가함.");
                    return done(null, user);
                });
            }
        });
    });
}));
passport.serializeUser(function(user, done){
    console.log('serializeUser() 호출됨.');
    console.dir(user);

    done(null, user);
});
passport.deserializeUser(function(user, done){
    console.log('deserializeUser() 호출됨.');
    console.dir(user);

    done(null, user);
});

var router= express.Router();
app.use('/',router);
// route_loader.init(app, router);

router.route('/').get(function(req, res){
    console.log('/ get 요청됨.');
    res.render('index.ejs',{});
})


router.route('/login')
.get(function(req,res){
    console.log('/login get');
    res.render('login',{message : req.flash('loginMessage')});
})
.post(passport.authenticate('local-login', {
    successRedirect : '/userlist',
    failureRedirect : '/login',
    failureFlash : true
}));

router.route('/signup')
.get(function(req,res){
    console.log('/signup get');
    res.render('signup',{message:req.flash('signupMessage')});
})
.post(passport.authenticate('local-signup',{
    successRedirect : '/profile',
    failureRedirect : '/signup',
    failureFlash : true
}));

router.route('/profile')
.get(function(req, res){
    console.log('/profile get');

    console.log('req.user 객체의 값');
    console.dir(req.user);

    if(!req.user){
        console.log('사용자 인증이 안 된 상태임.');
        res.redirect('/');
        return;
    }

    console.log('사용자 인증된 상태임.');
    if(Array.isArray(req,user)){
        res.render('profile',{user : req.user[0]._doc});
    }else{
        res.render('profile',{user : req.user});
    }
});

router.route('/logout')
.get(function(req, res){
    console.log('/logout get');
    req.logout();
    res.redirect('/');
});
// var authUser= function(database, id, password, callback){
//     console.log('authUser 호춛');

//     UserModel.findByEmail(email, function(err,results){
//         if(err){
//             callback(err,null);
//             return;
//         }
//         console.log('이메일 : %s 비밀번호 : %s',email,password);
//         console.dir(results);
//         if(results.length > 0){
//             console.log('아이디와 일치하는 사용자 찾음.',email,password);

//             var user= new UserModel({email:email});
//             var authenticated=user.authenticate(password, results[0]._doc.salt,results[0]._doc.hashed_password);
//             if(authenticated){
//                 console.log('비밀번호 일치함');
//                 callback(null,results);
//             }else{
//                 console.log('비밀번호 일치하지 않음');
//                 callback(null,null);
//             }
//         }else{
//             console.log('일치하는 사용자를 찾지 못함.');
//             callback(null,null);
//         }
//     });
// }
// var addUser= function(database,  id, password, name, callback){
//     console.log('adduser : '+id+':'+name+':'+password);

    
//     var user= new UserModel({"id":id,"password":password,"name":name});

//     user.save(function(err){
//         if(err){
//             callback(err,null);
//             return;
//         }   
//         console.log('사용자 데이터 추가함.');
//         callback(null,user);
//     });
// }
// var listuser= function(callback){
//     console.log('listuser');
    
//     UserModel.findAll(function(err,results){
//         console.log("listuser in findall");
//         if(err){
//             console.error(err);
//             callback(err,null);
//             return;
//         }
//         if(results){
//             console.dir(results);
//             callback(null,results);
//             return;
//         }
//         console.log("no data");
//         callback(null,null); 
//     });
// }


// router.route('/login')
//     .get(function(req,res){
//         console.log('/login get');
//         res.sendfile(__dirname+"/public/m_login.html");
//     })
//     .post(
//         // user.login
//         function(req,res){
//         console.log('/login post');

//         var paramId=req.body.id;
//         var paramPassword=req.body.password;
//         console.log(paramId+":"+paramPassword);
//         if(database){
//             authUser(database, paramId, paramPassword,function(err, docs){
//                 if(err){throw err;}
//                 if(docs){
//                     console.log('/login 성공');
//                     res.render('welcome',{
//                         id:paramId,
//                         name:name
//                     });
//                 }else{
//                     console.log('아이디,비밀번호오류');
//                     res.redirect('/login');
//                 }
//             });
//         }else{
//             console.log('db접속 실패');
//         }
//     }
//     );
// router.route('/adduser')
//     .get(function(req,res){
//         console.log('/adduser get');
//         res.sendFile(__dirname+"/public/m_register.html");
//     })
//     .post(
//         // user.addUser
//         function(req,res){
//         console.log('/adduser post');
//         var paramId= req.body.id;
//         var paramPassword= req.body.password;
//         var paramName= req.body.name;

//         console.log('요청 : '+paramId+':'+paramPassword+':'+paramName);

//         if(database){
//             addUser(database, paramId, paramPassword, paramName, function(err, result){
//                 if(err){throw err;}

//                 if(result && result.insertedCount > 0){
//                     console.dir(result);

//                     res.render('welcome',{
//                         id:paramId,
//                         name:paramName
//                     });
//                 }
//             });
//         }
//     }
//     );

// router.route('/listUser')
//     .get(function(req,res){
//         console.log('/listUser get');
//         res.sendfile(__dirname+"/public/userlist.html");
//     })
//     .post(
//         // user.listuser
//         function(req,res){
//         console.log('/listUser post');

//         if(database){
//             listuser(function(err,results){
//                 if(err){
//                     console.error("사용자 리스트 조회 중 오류 발생 : "+err.stack);
//                     res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
//                     res.write('<h1>오류</h1>');
//                     res.write('<p>'+err.stack+'</p>');
//                     res.end();
//                     return;
//                 }
//                 if(results){
//                     console.dir(results);
//                     res.render('userList',{results: results,length:results.length});
//                 }else{
//                     console.log('사용자 리스트 조회 실패');
//                     res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
//                     res.write('<h1>오류</h1>');
//                     res.write('<p>'+err.stack+'</p>');
//                     res.end();
//                 }
//             });
//         }else{
//             console.log('데이터베이스 연결 실팰')
//             res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
//             res.write('<h1>오류</h1>');
//             res.write('<p>'+err.stack+'</p>');
//             res.end();
//         }
//     }
//     );

// // var errorhandler= expressErrorHandler({
// //     static: {
// //         '404' : '/public/404.html'
// //     }
// // });

// // app.use(expressErrorHandler.httpError(404));

// // app.use(errorHandler);

http.createServer(app).listen(app.get('port'),function(){
    console.log('server is running : '+app.get('port'));

    connectDB();
    // userRoute.init(database, UserSchema, UserModel, express);
    // userRoute.init(database,UserSchema,UserModel);
    // database.init(app, config);
});