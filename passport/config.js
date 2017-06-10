module.exports= {
    server_port: 1222,
	db_url: 'mongodb://localhost:27017/local',
	db_schemas: [
	    {
            file:'C:/Users/dsm2016/Documents/GitHub/nodejs/socket/schema.js',
            collection:'newusers',
            schemaName:'UserSchema',
            modelName:'UserModel'
        }
	],
    route_info : [

    ]
};
