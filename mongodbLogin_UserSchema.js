var crypto=require('crypto');
// var mongodb=require('mongodb');
var mongoose=require('mongoose');

var Schema={ };

Schema.createSchema = function(mongoose){

    UserSchema=mongoose.Schema({
            id: {type:String,required:true,unique:true},
            name: {type: String,index:'hashed'},
            password: {type: String,required:true},
            age: {type: Number,'default':-1},
            created_at: {type: Date,index:{unique:false},'default':Date.now},
            updated_at: {type: Date,index:{unique:false},'default':Date.now}
        });

        UserSchema.static('findById',function(id,callback){
            console.log('IN FINDBYID');
            return this.findOne({id:id},callback);
        });

        UserSchema.static('findAll',function(callback){
            return this.find({ },callback);
        });

        console.log('UserSchema 정의함');

    return UserSchema; 
};

module.exports=Schema;