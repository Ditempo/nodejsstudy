var express= require('express')
    ,http= require('http')
    ,path= require('path');

var bodyParser= require('body-parser')
    ,cookieParser= require('cookie-parser')
    ,static= require('serve-static')
    ,errorHandler= require('errorhandler');

var ejs=require('ejs-locals');

var expressErrorHandler= require('express-error-handler');

var expressSession= require('express-session');

var app= express();

app.set('port',process.env.PORT || 1222);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use('/public',static(path.join(__dirname,'public')));

app.use(cookieParser());

app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));

var MongoClient= require('mongodb').MongoClient;

var database;

function connectDB(){
    var databaseUrl='mongodb://localhost:27017/shopping';

    MongoClient.connect(databaseUrl, function(err,db){
        if(err) throw err;

        console.log('데이터베이스에 연결 '+databaseUrl);

        database= db;
    })
}

var authUser= function(database, id, password, callback){
    console.log('authUser 호춛');

    var users=database.collection('ReUsers');

    users.find({"id" : id,"password" : password}).toArray(function(err,docs){
        console.dir(docs);
        if(err){
            callback(err, null);
            return;
        }
        if(docs.length){
        console.log('아이디 :%s\n',id);
        callback(null,docs);
        } else {
            console.log("일치하는 사용자를 찾지 못함");
            callback(null,null);
        }
    });
}
var addUser= function(database,  id, password, name, callback){
    console.log('adduser : '+id+':'+name+':'+password);

    var users=database.collection('ReUsers');

    users.insertMany([{"id":id,"password":password,"name":name}],function(err,result){
        if(err){
            callback(err,null);
            return;
        }
        if(result.insertedCount > 0){
            console.log("사용자 추가됨 : "+result.insertedCount);
        }else{
            console.log('추가된 사용자 없음');
        }

        callback(null,result);
    });
}

var router= express.Router();
app.use('/',router);

router.route('/login')
    .get(function(req,res){
        console.log('/login get');
        res.sendfile(__dirname+"/public/m_login.html");
    })
    .post(function(req,res){
        console.log('/login post');

        var paramId=req.body.id;
        var paramPassword=req.body.password;
        console.log(paramId+":"+paramPassword);
        if(database){
            authUser(database, paramId, paramPassword,function(err, docs){
                if(err){throw err;}
                if(docs){
                    console.log('/login 성공');
                    res.render('welcome',{id:paramId,name:username});
                }else{
                    console.log('아이디,비밀번호오류');
                    res.redirect('/login');
                }
            });
        }else{
            console.log('db접속 실패');
        }
    });
router.route('/adduser')
    .get(function(req,res){
        console.log('/adduser get');
        res.sendFile(__dirname+"/public/m_register.html");
    })
    .post(function(req,res){
        console.log('/adduser post');

        var paramId= req.body.id;
        var paramPassword= req.body.password;
        var paramName= req.body.name;

        console.log('요청 : '+paramId+':'+paramPassword+':'+paramName);

        if(database){
            addUser(database, paramId, paramPassword, paramName, function(err, result){
                if(err){throw err;}

                if(result && result.insertedCount > 0){
                    console.dir(result);

                    res.render('welcome',{
                        id:paramId,
                        name:paramName
                    });
                }
            });
        }
    });


// var errorhandler= expressErrorHandler({
//     static: {
//         '404' : '/public/404.html'
//     }
// });

// app.use(expressErrorHandler.httpError(404));

// app.use(errorHandler);

http.createServer(app).listen(app.get('port'),function(){
    console.log('server is running : '+app.get('port'));

    connectDB();
});