var http=require('http');
var express=require('express');
var session=require('express-session');
var bodyParser = require('body-parser');
var mysql=require('mysql');
/*
var connection=mysql.createConnection({
  host : 'loclalhost',
  user : 'root',
  password : '123456',
  port : 1222,
  database : 'login_db'
});
*/
var app=express();
var port=1444;
//var host='10.156.145.122';
var host='127.0.0.1';
/*
connetion.connect(function(err){
  if(!err){
    console.log('database is connected');
  }
})
*/
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret:'456sdf#$%^#',
  resave: false,
  saveUninitialized: true
}));

//connection.connect();
/*
var sql='SELECT * from Login';
connetion.query(sql,function(err,rows,fields){
  if(err){
    console.log(err);
  } else {

  }
});

connection.end();
*/

app.get('/count',function(req,res){
  if(req.session.count){
    req.session.count++;
  } else {
    req.session.count=1;
  }
  res.send('count :'+req.session.count);
});

app.get('/welcome',function(req,res){

  if(req.session.usernickname){
    res.send(`
      <h1>hello, ${req.session.usernickname}</h1>
      <a href="/logout">logout</a>
    `);
  } else {
    res.send(`
      <h1>welcome</h1>
      <a href="/login">login</a>
    `);
  }


});
app.get('/logout',function(req,res){
  delete req.session.usernickname;
  res.redirect('/welcome');
})
app.post('/login',function(req,res){
  var user={
    username:'aaa',
    password:'111',
    usernickname:'bbb'
  };
  var id=req.body.username;
  var pwd=req.body.password;
  if(id ===user.username && pwd ===user.password){
    req.session.usernickname = user.usernickname;
    res.redirect('/welcome');
  } else {
    res.send('who are u <a href="/login">login</a>');
  }

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
app.listen(port,host,function(){
  console.log('http://'+host+':'+port);
});
