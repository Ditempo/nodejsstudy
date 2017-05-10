var express= require('express')
    ,http= require('http')
    ,path= require('path');

var bodyParser= require('body-parser')
    ,cookieParser= require('cookie-parser')
    ,static= require('serve-static')
    ,errorHandler= require('errorhandler');

var expressErrorHandler= require('express-error-handler');

var expressSession= require('express-session');

var multer= require('multer');
var fs= require('fs');

var cors= require('cors');

var app=express();

app.set('port',process.env.PORT || 1222);
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/public',static(path.join(__dirname,'public')));
app.use('/uploads',static(path.join(__dirname, 'uploads')));

app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));


app.use(cors());

var storage= multer.diskStorage({
    destination: function (req,file,callback){
        callback(null,'uploads');
    },
    filename: function (req,file,callback) {

        callback(null,file.originalname+ Date.now());
    }
});

var upload= multer({
    storage: storage,
    limits: {
        files: 10,
        fileSize: 1024*1024*1024
    }
});

var router=express.Router();

router.route('/process/photo').post(upload.array('photo',1),function(req,res){
    console.log('/process/photo 호출됨');

    try{
        var files=req.files;

        console.dir('#====== 업로드된 첫번째 파일 정보 =====#');
        console.dir(req.files[0]);
        console.dir('#=====#');

        var originalnmae='',
            filename='',
            mimetype='',
            size=0;

        if(Array.isArray(files)){
            console.log("배열에 들어있는 파일 갯수: %d",files.length);

            for(var index=0;index<files.length;index++){
                originalnmae=files[index].originalnmae;
                filename=files[index].filename;
                mimetype=files[index].mimetype;
                size=files[index].size;
            }
            
        }else{
            console.log('파일 갯수 : 1');
            originalnmae=files[index].originalnmae;
            filename=files[index].filename;
            mimetype=files[index].mimetype;
            size=files[index].size;
        }
        console.log('현재 파일 정보 : '+originalnmae+','+filename+','+mimetype+','+size);

        res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
        res.write('<h3>파일 업로드 성공</h3>');
        res.write('<hr/>');
        res.write('<p>원본 파일 이름 : '+originalnmae+'-> 저장 파일명 : '+filename+'</p>');
        res.write('<p>파일크기 : '+size+'</p>');
        res.end();
        
    }catch(err){
        console.dir(err.stack);
    }
});

app.use('/',router);

var Server=app.listen(1222,function(){
    console.log('server runing');
});