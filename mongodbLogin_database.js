var mongodb= require("mongodb");
var mongoose= require('mongoose');

var database={};

database.init= function(app, config){
    console.log('init호출');

    connect(app, config);
}

