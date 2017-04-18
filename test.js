var express=require('express');
var app=express();
var port=1222;
app.use(express.static(__dirname+'/public'));

app.get('/login',function(req,res){
  console.log('get login');
  res.sendFile(__dirname+'/public/login.html');
});
app.post('/login',function(req,res){
  console.log('post login');
});

app.listen(port,function(){
  console.log('http://loclalhost:'+port);
});
