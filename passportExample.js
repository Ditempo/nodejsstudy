var express=require("express")
    ,http=require("http")
    ,path=require('path');

var bodyParser=require('body-parser')
    ,cookieParser=require('cookie-parser');

var expressSession=require('express-session');
var ejs=require('ejs-locals');

var mongodb=require('mongodb')
    ,mongoose=require('mongoose');

var passport= require('passport')
    ,flash= require('connect-flash');

var app= express();


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
        UserModel=mongoose.model("passportUsers",UserSchema);
        
        console.log('user 정의함');
    });
    database.on('disconneted',connectDB);
}


var LocalStrategy= require('passport-local').Strategy;

passport.use('local-login',new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
    }, function(req, email, password, done){
        console.log('passport의 local-login 호출됨 : '+email+','+password);

        var database= app.get('database');
        database.UserModel.findOne({'email':email},function(err, user){
            if(err){return done(err);}

            if(!user){
                console.log('계정이 일치하지 않음');
                return done(null, false, req.flash('loginMessage','등록된 계정이 없습니다.'));
            }
            // var authenticated= user.authenticated(password, user._doc.password);
            if(password!=user._doc.password){
                console.log('비밀번호 일치하지 않음');
                return done(null,false,req.flash('loginMessage','비밀번호가 일치하지 않습니다.'));
            }

            console.log('계정과 비밀번호가 일치함.');
            return done(null,user);
        });
}));

passport.use('local-signup',new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
    }, function(req, email, password, done){
        var paramName=req.body.name;
        console.log('passport의 local-singup 호출됨 : '+email+','+password+','+paramName);

        process.nextTick(function(){
            var database=app.get('database');
            database.UserModel.findOne({'email':email},function(err, user){
                if(err){
                    return done(err);
                }

                if(user){
                    console.log('기존에 계정이 있음');
                    return done(null,false,req.flash('signupMessage','계정이 이미 있습니다.'));
                }else{
                    var user=new database.UserModel({'email':email,'password':password,'name':paramName});
                    
                    user.save(function(err){
                        if(err){throw err;}
                        console.log("사용자 데이터 추가함");
                        return done(null,user);
                    });
                }
            });
        });
}));

passport.serializeUser(function(user, done){
    console.log('deserializeUser() 호출됨');
    console.dir(user);

    done(null, user);
});

var router= express.Router();

// route_loader.init(app, router);

route.route('/').get(function(req,res){
    console.log('/ 패스 요청됨');
    res.render('index.ejs');
});

app.get('/login',function(req,res){
    console.log('/login 패스 요청됨');
    res.render('login.ejs',{message : req.flash('loginMessage')});
});

app.post('/login',passport.authenticate('local-login',{
    successRedirect : '/profile',
    failuRedirect : '/login',
    failureFlash : true
}));

app.get('/signup',function(req,res){
    console.log('/signup 패스 요청됨');
    res.render('signup.ejs',{message : req.flash('signupMessage')});
});

app.post('/signup',passport.authenticate('local-signup',{
    successRedirect : '/profile',
    failureRedirect : '/signup',
    failureFlash : true
}));

router.route('/profile').get(function(req,res){
    console.log('/profile 패스 요청됨');

    console.log('req.user 객체의 값');
    console.dir(req.user);

    if(!req.user){
        console.log('사용자 인증이 안 된 상태임');
        res.redirect('/');
        return;
    }

    console.log('사용자 인증된 상태임');
    if(Array.isArray(req.user)){
        res.render('profile.ejs',{user : req.user[0]._doc});
    }else{
        res.render('profile.ejs',{user : req.user});
    }
});

app.get('/logout',function(req,res){
    console.log('/logout 패스 요청됨');
    req.logOut();
    res.redirect('/');
});

var server=app.listen(port,function(){
    console.log("server runing");

    connectDB();
})

