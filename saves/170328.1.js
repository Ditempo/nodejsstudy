var http=require('http');
var express=require('express');
var session=require('express-session');
var bodyParser = require('body-parser');
var mysql=require('mysql');
var MySqlStore=require('express-mysql-session')(session);
//var FileStore=require('session-file-store')(session);
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
  store: new MySqlStore({
    host: 'localhost',
    port: 1222,
    user: 'root',
    password: '123456',
    database: 'users'
  })
}));

app.get('/count',function(req,res){
  if(req.session.count){
    req.session.count++;
  } else {
    req.session.count=1;
  }
  res.send('count :'+req.session.count);
});
var users =[
  {
  username:'aaa',
  password:'6fSTqiQ4qPqm8o6cCzqRLPq3JvhFXOkq3g3ZSgKEgbEXxxCfta+mfWZQUvsaWVdlC5C6cj4sUwuepolP90pomzfTPI3zZ6T/7oQchcuzkx2gmrCl6Mu8oqiP7HmZnuB60jQJ6+MmSbDhvico+jbuYq0heX/jFej4mmQdl9FHGGU=',
  salt:'oAOogRhiGf1qJVdSNqekWwchonzzUyCOB7J907hNgLLrcYt5WF7dkjOZIygCf7L6CxDwzFLgGhfZqWq3h6N5cw==',
  displayname:'bbb'
  }
];
app.get('/welcome',function(req,res){

  if(req.session.displayname){
    res.send(`
      <h1>hello, ${req.session.displayname}</h1>
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
  hasher({password:req.body.password},function(err,pass,salt,hash){
    var user={
      username:req.body.username,
      password:hash,
      salt:salt,
      displayname:req.body.displayname
    };
    users.push(user);
    req.session.displayname=req.body.displayname;
    req.session.save(function(){
      res.redirect('/welcome')
    });
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
  delete req.session.displayname;
  req.session.save(function(){
    res.redirect('/welcome');
  });
})
app.post('/login',function(req,res){
  var id=req.body.username;
  var pwd=req.body.password;
  for(var i=0;i<users.length;i++){
    var user=users[i];
    if(id === user.username){
      return hasher({password:pwd, salt:user.salt},function(err,pass,salt,hash){
        if(hash === user.password){
          req.session.displayname= user.displayname;
          req.session.save(function(){
            res.redirect('/welcome');
          })
        } else{
          res.send('who are u <a href="/login">login</a>');
        }
      });
    }
  }
  res.send('who are u <a href="/login">login</a>');
})
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
})
app.listen(port,function(){
  console.log('http://loclalhost:'+port);
});
