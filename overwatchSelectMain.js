var express=require('express');
var http=require('http');
var https=require('https');
var path=require('path');

var bodyParser=require('body-parser');
var request=require('request');
var socket=require('socket.io');
var cookieParser=require('cookie-parser');
var expressSession=require('express-session');
var sync=require('sync');
var ejs=require('ejs-locals');

var mongodb=require('mongodb');
var monoose=require('mongoose');

var app=express();

var port=1222;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use('/public',express.static(path.join(__dirname,'public')));

app.use(bodyParser.urlencoded({extended:true}));

app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized:true
}));
