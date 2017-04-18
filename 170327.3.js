//망한 소스
var http=require('http');
var express=require('express');
var session=require('express-session');
var bodyParser = require('body-parser');
var mysql=require('mysql');
var MySqlStore=require('express-mysql-session')(session);
var passport = require('passport')
//var LocalStrategy = require('passport-local').Strategy;
var fileStore=require('session-file-store')(session);
var app=express();
var port=1222;
//var host='10.156.145.122';
//var host='127.0.0.1';
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret:'456sdf#$%^#',
  resave: false,
  saveUninitialized: true,
  store: new fileStore()
}));
var users =[
  {
  username:'aaa',
  password:'111',
  nickname:'bbb'
  }
];
// app.post('/login',function(req,res){
//   var id=req.body.username;
//   var pwd=req.body.password;
//   for(var i=0;i<users.length;i++){
//     var user=users[i];
//     if(id ===user.username && pwd ===user.password){
//       req.session.nickname = user.nickname;
//       return req.session.save(function(){
//          res.redirect('/welcome');
//       });
//     }
//   }
//   res.send('who are u <a href="/login">login</a>');
// })
app.get('/login',function(req,res){
  var output=`
  <h1>login post</h1>
  <form action='/login' method='post'>
    <p>
      id
    </p>
      <p>
        <input type='text' name='username' >
      </p>
      <p>
      password
      </p>
      <p>
        <input type='password' name='password'>
      </p>
      <p>
      <input type='submit' name='submit'></p>
  </form>`;
  res.send(output);
});
app.get('/count',function(req,res){
  if(req.session.count){
    req.session.count++;
  } else {
    req.session.count=1;
  }
  res.send('count :'+req.session.count);
});

app.get('/welcome',function(req,res){

  if(req.session.nickname){
    res.send(`
      <h1>hello, ${req.session.nickname}</h1>
      <a href="/logout">logout</a>
    `);
  } else {
    res.send(`
      <h1>welcome</h1>
      <ul>
        <li><a href="/login">login</a></li>
        <li><a href="/register">register</a></li>
      </ul>
    `);
  }
});
app.post('/register',function(req,res){
  var user={
    username:req.body.username,
    password:req.body.password,
    nickname:req.body.nickname
  };

  users.push(user);
  req.session.nickname=req.body.nickname;
  req.session.save(function(){
    res.redirect('/welcome')
  });
});

app.get('/register',function(req,res){
  var output=`
  <h1>register</h1>
  <form action=""/register" method="post">
  <p>
    id
  </p>
    <p>
      <input type='text' name='username' >
    </p>
    <p>
    password
    </p>
    <p>
      <input type='password' name='password'>
    </p>
    nickname
    </p>
    <p>
      <input type='text' name='nickname'>
    </p>
    <p>
    <input type='submit' name='submit'>
    </p>
    </form>
    `;
    res.send(output);
})
app.get('/logout',function(req,res){
  delete req.session. nickname;
  req.session.save(function(){
    res.redirect('/welcome');
  });
});
passport.serializeUser(function(user, done) {
  console.log('serializeUser',user);
  done(null, user.username);
});

passport.deserializeUser(function(id, done) {
  console.log('deserializeUser',id);
  for(var i=0;i<users.length;i++){
    var user=users[i];
    if(usr.username===id){
      done(null,user);
    }
  }

});
passport.use(new LocalStrategy(
  function(username, password, done){
    var id=req.body.username;
     var pwd=req.body.password;
     for(var i=0;i<users.length;i++){
       var user=users[i];
       if(id ===user.username && pwd ===user.password){
         console.log('LocalStrategy',user);
         done(null,user);

      }else{
        done(null, false);
      }
     }
     doen(null, false);

  }
));
app.post('/login',
  passport.authenticate(
  'local',
  {
    successRedirect: '/welcome',
    failureRedirect: '/login',
    failureFlash: false
   }
  )
);
/*
app.listen(port,host,function(){
  console.log('http://'+host+':'+port);
});
*/
app.listen(port,function(){
  console.log('http://loclalhost:'+port);
});
