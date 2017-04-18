var http=require('http');
var express=require('express');
var session=require('express-session');
var path=require('path');
var cookieParser=require('cookie-parser');
var bodyParser = require('body-parser');

var app=express();
var port=1222;

app.use('/public',express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({ extended: false }));
