var http= require('http');
var fs= require('fs');
var server= http.createServer();

var port=2222;
var host="10.156.145.122";

server.listen(port,host,'50000',function(){
  console.log('웹서버가 실행함'+host+','+port);
});
/*
server.listen(port,function(){
  console.log('웹서버가 실행 함 '+port);
});
*/
server.on('connection',function(socket){
  var addr=socket.address();
  console.log('클라이언트가 접속함. %s, %d',addr.address,addr.port);
});

server.on('request',function(req,res){
  console.log('클라이언트 요청이 들어왔습니다.');


  var filename='player.png';
  fs.readFile(filename,function(err, data){
    res.writeHead(200,{'Content-Type':'image/png'});
    res.write(data);
    res.end();
  });
  /*
  var infile=fs.createReadStream(filename,{flags: 'r'});
  var filelength=0;
  var curlength=0;

  fs.stat(filename, function(err, stats){
    filelength= stats.size;
  });

  res.writeHead(200,{'Content-Type': 'image/png'});

  infile.on('readable',function(){
    var chunk;
    while(null!=(chunk=infile.read())){
      console.log('읽어 들인 데이터 크기 : %d 바이트',chnk.length);
      curlength+=chunk.length;
      res.write(chunk,'utf8',function(err){
        console.log('파일 부분 쓰기 완료 : %d,파일크기: %d ',curlength,filelength);
        if(curlength>=filelength){
          res.end();
        }
      });
    };
  });
  */
});

server.on('close',function(){
  console.log('서버가 종료됩니다.');
});
