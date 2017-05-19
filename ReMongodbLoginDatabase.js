var mongoose= require('mongoose');

var database= {};

database.init= function(app, config){
    console.log('init() 호출됨');

    connect(app, config);
}

function connect(app, config){
    console.log('connect() 호출됨');

    
    // 'mongodb://localhost:27017/shopping'
    console.log('데이터베이스 연결을 시도합니다.');
    mongoose.Promise= global.Promise;
    mongoose.connect(config.db_url);
    database.db= mongoose.connection;

    database.db.on('error',console.error.bind(console,'mogoose connection error.'));
    database.db.on('open',function(){

        console.log('데이터베이스에 연결되었습니다. : '+config.db_url);

         createSchema(app, config);
        
    });
    database.db.on('disconnected',function(){
        console.log('연결이 끊어졌습니다. 5초후 다시 연결합니다.');
        setInterval(connect,5000);
    });
}

function createSchema(app, config) {
	var schemaLen = config.db_schemas.length;
	console.log('설정에 정의된 스키마의 수 : %d', schemaLen);
	
	for (var i = 0; i < schemaLen; i++) {
		var curItem = config.db_schemas[i];
		console.log(schemaLen);
		// 모듈 파일에서 모듈 불러온 후 createSchema() 함수 호출하기
		var curSchema = require(curItem.file).createSchema(mongoose);
		console.log('%s 모듈을 불러들인 후 스키마 정의함.', curItem.file);
		
		// User 모델 정의
		var curModel = mongoose.model(curItem.collection, curSchema);
		console.log('%s 컬렉션을 위해 모델 정의함.', curItem.collection);
		
		// database 객체에 속성으로 추가
		database[curItem.schemaName] = curSchema;
		database[curItem.modelName] = curModel;
		console.log('스키마 이름 [%s], 모델 이름 [%s] 이 database 객체의 속성으로 추가됨.', curItem.schemaName, curItem.modelName);
	}
	
	app.set('database', database);
    console.log('database 객체가 app 객체의 속성으로 추가됨');
    console.log('database 준비끝');
}

module.exports= database;