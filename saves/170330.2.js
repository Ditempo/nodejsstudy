var http=require('http');
var express=require('express');
var session=require('express-session');
var bodyParser = require('body-parser');
var mysql=require('mysql');
var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
var FacebookStrategy=require('passport-facebook').Strategy;
//var MySqlStore=require('express-mysql-session')(session);
var FileStore=require('session-file-store')(session);
var bkfd2Password=require('pbkdf2-password');
var app=express();
var port=1222;
var hasher=bkfd2Password();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret:'456sdf#$%^#',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
  // new MySqlStore({
  //   host: 'localhost',
  //   port: 1222,
  //   user: 'root',
  //   password: '123456',
  //   database: 'o2'
  // })
}));
app.use(passport.initialize());
app.use(passport.session());
app.get('/count',function(req,res){
  if(req.session.count){
    req.session.count++;
  } else {
    req.session.count=1;
  }
  res.send('count :'+req.session.count);
});

// passport.serializeUser(function(user, done) {
//   console.log('serializeUser',user);
//   done(null, user.username);
// });
//
// passport.deserializeUser(function(id, done) {
//   console.log('deserializeUser',id);
//   for (var i = 0; i < users.length; i++) {
//     var user=users[i]
//     if(user.username===id){
//       return done(null,user);
//     }
//   }
// });
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy(
  function(username, password, done){
    var uname=username;
    var pwd=password;
    for(var i=0;i<users.length;i++){
      var user=users[i];
      if(uname === user.username){
        return hasher({password:pwd, salt:user.salt},function(err,pass,salt,hash){
          if(hash === user.password){
            console.log('LocalStrategy',user);
            done(null,user);
          } else{
            done(null,false);
          }
        });
      }
    }
    done(null,false);
  }
));
passport.use(new FacebookStrategy({
    clientID: 274852889620132,
    clientSecret: '8bc602e6317ba06dab209ca8e8dcbddc',
    callbackURL: '/facebook/callback'
  },
  //{'facebook.id': profile.id}
  function(accessToken, refreshToken, profile, done) {
    // User.findOrCreate(...,function(err, user){
    //   if(err){ return done(err); }
      done(null,users);
    // });
  }
));
app.post('/login',
  passport.authenticate('local',
    {
      successRedirect: '/welcome',
      failureRedirect: '/login',
      failureFlash: false
    }
  )
);

app.get('/facebook',
  passport.authenticate('facebook'
  )
);
app.get('/facebook/callback',
  passport.authenticate('facebook',
  {
    successRedirect: '/welcome',
    failureRedirect: '/login'
   }
  )
);
var users =[
  {
  username:'aaa',
  password:'6fSTqiQ4qPqm8o6cCzqRLPq3JvhFXOkq3g3ZSgKEgbEXxxCfta+mfWZQUvsaWVdlC5C6cj4sUwuepolP90pomzfTPI3zZ6T/7oQchcuzkx2gmrCl6Mu8oqiP7HmZnuB60jQJ6+MmSbDhvico+jbuYq0heX/jFej4mmQdl9FHGGU=',
  salt:'oAOogRhiGf1qJVdSNqekWwchonzzUyCOB7J907hNgLLrcYt5WF7dkjOZIygCf7L6CxDwzFLgGhfZqWq3h6N5cw==',
  displayname:'bbb'
  }
];
app.get('/welcome',function(req,res){

  if(req.user && req.user.displayname){
    res.send(`
      <h1>hello, ${req.user.displayname}</h1>
      <a href="/logout">logout</a>
    `);
  } else {
    res.send(`
      <h1>welcome</h1>
      <h1>${req.session.}</h1>
      <ul>
        <li><a href="/login">login</a></li>
        <li><a href="/register">register</a></li>
      </ul>
    `);
  }
});
app.post('/register',function(req,res){
  hasher({password:req.body.password},function(err,pass,salt,hash){
    var user={
      username:req.body.username,
      password:hash,
      salt:salt,
      displayname:req.body.displayname
    };
    users.push(user);
    req.login(user, function(err){
      req.session.save(function(){
        res.redirect('/welcome')
      });
    })
  });
});

app.get('/register',function(req,res){
  var output=`
  <h1>register</h1>
  <form action="/register" method="post">
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
    displayname
    </p>
    <p>
      <input type='text' name='displayname'>
    </p>
    <p>
    <input type='submit' name='submit'>
    </p>
    </form>
    `;
    res.send(output);
})
app.get('/logout',function(req,res){
    req.logout();
    req.session.save(function(){
    res.redirect('/welcome');
  });
});

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
  </form>
  <a href='/facebook'>facebook</a>`;
  res.send(output);
})
app.listen(port,function(){
  console.log('http://localhost:'+port);
});
