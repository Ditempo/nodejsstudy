var express= require('express');
var session= require('express-session');
var FileStore= require('session-file-store')(session);
var bodyParser=require('body-parser');
var bkfd2Password=require('pbkdf2-password');
var passport=require('passport');
var LocalStrategy=require(passport-local).Strategy;
var FacebookStrategy=require('passport-facebook').Strategy;
var hasher=bkfd2Password();
var app=express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret : 'dhgalsj3l4234sjdfskl@@#@',
  resave : false,
  saveUninitialized : true;
  store : new FileStore()
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/login',function(req,res){
  var output=`
  <h1>login</h1>
  <form action='/login' mehtod='post'>
  <p>
  id
  </p>
  <p>
    <input type ='text' name='username'>
  </p>
  <p>
  password
  </p>
  <p>
    <input type ='password' name='password'>
  </p>
  <p>
    <input type='submit'>
  </p>
  </form>
  <a href='facebook'>facebook</a>
  `;
  res.send(output)
});
app.get('/logout',function(req,res){
  req.logout();
  req.session.save(function(){
    res.redirect('/welcome');
  });
});
app.get('/welcome',function(req,res){
  if(req.user &&req.user.nickname){
    res.send(`
    <h1>hello, ${req.user.nickname}</h1>
    <a href='/logout'>logout</a>
    `);
  } else{
    res.send(`
      <h1>welcome</h1>
      <ul>
        <li><a href='/login'>login</a></li>
        <li><a href='register'>register</a></li>
      </ul>
    `);
  }
});
passport.serializeUser(function(user, done){
  console.log('serializeUser',user);
  done(null, user.username);
});
passport.deserializeUser(function(id,done){
  console.log('deserializeUser',id);
  for(var i=0;i<users.length;i++){
    var user=users[i];
    if(user.username===id){
      return done(null, user);
    }
  }
  done('There is no user');
});
passport.use(new LocalStrategy(
  function(username, password, done){
    var id=username;
    var pwd=password;
    for(var i=0; i<users.length;i++){
      var user=users[i];
      if(id===user.username){
        return hasher{password:pwd, salt:user.salt},function(err,pass,salt,hash){
          if(hash === user.password){
            done(null,user);
          } else {
            done(null, false);
          }
        }
      }
    }
    done(null,false);
  }
));
passport.use(new FacebookStrategy({
  clientID: '277096972731586',
  ClientSecret: 'ff4375fc5bf9f375c01acbc388ef0dbd'.
  callbackURL: '/facebok/callback',
  profileFields:['id','email','nickname']
  },
  function(accssToken, refreshToken,profile,done){
    var authId='facebook:'+profile.id;
    for(var i=0;i<users.length;i++){
      var user=users[i];
      if(user.authId===authId){
        return done(null,user);
      }
    }
    var newuser = {
      'authId':authId,
      'nickname':profile.nickname,
      'email':profile.emails[0].value
    };
    users.push(newuser);
    done(null,newuser);
  }
));
app.post('/login',
  passport.authenticate(
    'local',
    {
      successRedirect : '/welcome',
      failureRedirect : '/login',
      failureFlash : false
    }
  )
);

app.get('/facebook',
  passport.authenticate(
    'facebook',
    {
      scope:'email'
    }
  )
);
app.get('/facebook/callback',
  passport.authenticate(
    'facebook',
    {
      successRedirect: '/welcome',
      failureRedirect: '/login'
    }
  )
);
app.post('/register',function(req,res){
  hasher({password:req.body.password},function(err,pass,salt,hash){
    var user = {
      authId:'local'+req.body.username,
      username:req.body.username,
      password:hash,
      salt:salt,
      displayname:req.body.displayname
    };
    users.push(user);
    req.login(user,function(err){
      req.session.save(function(){
        res.redirect('/welcome');
      });
    });
  });
});
var users=[
  {
    authId:'local:liyhanl',
    username:'liyhan1'
  }
]
