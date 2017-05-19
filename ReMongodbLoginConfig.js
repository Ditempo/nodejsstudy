module.exports= {
    server_port : 1222,
    db_url : 'mongodb://localhost:27017/local',

    db_schemas : [
        {
            file : __dirname+'/ReMongodbLoginUserSchema.js',
            collection : 'reusers',
            schemaName : 'UserSchema',
            modelName : 'UserModel'
        }
    ],

}