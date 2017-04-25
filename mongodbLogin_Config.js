module.exports={
    server_port:1222,
    db_url : 'mongodb://localhost:27017/shopping',
    db_schemas : [
        {
            file:'./mongodbLogin_UserSchema',
            collection:'user',
            schemaName:'UserSchema',
            modelName:'UserModel'
        }
    ],
    route_info : [
        
    ]
}