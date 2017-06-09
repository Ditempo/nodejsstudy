var express= require('express')
    ,http= require('http')
    ,path= require('path');

var bodyParser= require('body-parser')
    ,cookieParser= require('cookie-parser')
    ,static= require('serve-static')
    ,errorHandler= require('errorhandler');

var ejs=require('ejs-locals');

// var userRoute= require(__dirname+'/ReMongodbLoginUser.js');
var config= require(__dirname+'/Config.js');
// var route_loader= require(__dirname+'/routes/route_loader');
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

var router= express.Router();
app.use('/',router);



var database= require('./database/database.js');


var LocalStrategy= require('passport-local').Strategy;

//패스포트 로그인 설정
passport.use('local-login', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true   // 이 옵션을 설정하면 아래 콜백 함수의 첫번째 파라미터로 req 객체 전달됨
	}, function(req, email, password, done) { 
		console.log('passport의 local-login 호출됨 : ' + email + ', ' + password);
		
		var database = app.get('database');
	    database.UserModel.findOne({ 'email' :  email }, function(err, user) {
	    	if (err) { return done(err); }

	    	// 등록된 사용자가 없는 경우
	    	if (!user) {
	    		console.log('계정이 일치하지 않음.');
	    		return done(null, false, req.flash('loginMessage', '등록된 계정이 없습니다.'));  // 검증 콜백에서 두 번째 파라미터의 값을 false로 하여 인증 실패한 것으로 처리
	    	}
	    	
	    	// 비밀번호 비교하여 맞지 않는 경우
			var authenticated = user.authenticate(password, user._doc.salt, user._doc.hashed_password);
			if (!authenticated) {
				console.log('비밀번호 일치하지 않음.');
				return done(null, false, req.flash('loginMessage', '비밀번호가 일치하지 않습니다.'));  // 검증 콜백에서 두 번째 파라미터의 값을 false로 하여 인증 실패한 것으로 처리
			} 
			
			// 정상인 경우
			console.log('계정과 비밀번호가 일치함.');
			return done(null, user);  // 검증 콜백에서 두 번째 파라미터의 값을 user 객체로 넣어 인증 성공한 것으로 처리
	    });

	}));


// 패스포트 회원가입 설정
passport.use('local-signup', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true    // 이 옵션을 설정하면 아래 콜백 함수의 첫번째 파라미터로 req 객체 전달됨
	}, function(req, email, password, done) {
        // 요청 파라미터 중 name 파라미터 확인
        var paramName = req.body.name || req.query.name;
	 
		console.log('passport의 local-signup 호출됨 : ' + email + ', ' + password + ', ' + paramName);
		
	    // findOne 메소드가 blocking되지 않도록 하고 싶은 경우, async 방식으로 변경
	    process.nextTick(function() {
	    	var database = app.get('database');
		    database.UserModel.findOne({ 'email' :  email }, function(err, user) {
		        // 에러 발생 시
		        if (err) {
		            return done(err);
		        }
		        
		        // 기존에 사용자 정보가 있는 경우
		        if (user) {
		        	console.log('기존에 계정이 있음.');
		            return done(null, false, req.flash('signupMessage', '계정이 이미 있습니다.'));  // 검증 콜백에서 두 번째 파라미터의 값을 false로 하여 인증 실패한 것으로 처리
		        } else {
		        	// 모델 인스턴스 객체 만들어 저장
		        	var user = new database.UserModel({'email':email, 'password':password, 'name':paramName});
		        	user.save(function(err) {
		        		if (err) {
		        			throw err;
		        		}
		        		
		        	    console.log("사용자 데이터 추가함.");
		        	    return done(null, user);  // 검증 콜백에서 두 번째 파라미터의 값을 user 객체로 넣어 인증 성공한 것으로 처리
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
    successRedirect : '/profile',
    failureRedirect : '/login',
    failureFlash : true
}));

router.route('/signup')
.get(function(req,res){
    console.log('/signup get');
    res.render('signup',{message:req.flash('signupMessage')});
})
.post(passport.authenticate('local-signup', {
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
    if(Array.isArray(req.user)){
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

// // var errorhandler= expressErrorHandler({
// //     static: {
// //         '404' : '/public/404.html'
// //     }
// // });

// // app.use(expressErrorHandler.httpError(404));

// // app.use(errorHandler);

var server=http.createServer(app).listen(app.get('port'),function(){
    console.log('server is running : '+app.get('port'));

    database.init(app, config);
   
});