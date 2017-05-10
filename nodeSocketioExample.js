var express=require('express');
var app=express();
var Server=require('http').createServer(app);

var io=require('socket.io')(Server);

app.get('/',function(req,res){
    res.sendFile(__dirname+'/nodeSocketioExample.html');
});

io.on('connection',function(socket){

    socket.on('event_name',function(data){
        console.log('Client logged-in: name:'+data.name+'userid: '+data.userid);

        socket.name= data.name;
        socket.userid= data.userid;

        io.emit('login',data.nmae);
    });

    socket.on('chat',function(data){
        console.log('Message from %s: %s',socket.name,data.msg);

        var msg={
            from: {
                name: socket.name,
                userid: socket.userid
            },
            msg: data.msg
        };

        socket.broadcast.emit('chat',msg);
    });

    socket.on('forceDisconnect',function(){
        socket.disconnect();
    });

    socket.on('disconnect',function(){
        console.log('user disconnected; '+socket.nmae);
    });
});

Server.listen(1222,function(){
    console.log('Socket Io server Listening on port 1222');
});