var express=require('express');
var bodyParser=require('body-parser');
var multer=require('multer');
var ejs=require('ejs');
/*
var _storage=multer.diskStorage({
  destination
})
*/
var app=express();
app.set('view engine','ejs');
app.set('views','/views');
app.use(express.static('public'));

app.get('/template',function(req,res){
  res.rander('index');
})
var mysql = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  port : 1222,
  database : 'o2'
});

conn.connect();

//var sql='UPDATE topic SET title=?, author=? WHERE id=?;'
var sql='DELETE from topic WHERE id=?'
var params=[5];
conn.query(sql,params,function(err, rows, fields){
  if(err){
    console.log(err);
  }else{
    console.log(rows);
  }
});
conn.end();
