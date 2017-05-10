var express= require('express');



var passport= require('passport')
    ,flash= require('connect-flash');

var app= express();

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

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
                return done(null, false, req.flash('loginMessage','등록된 계정이 없습니다'));
            }
        })
    }
))