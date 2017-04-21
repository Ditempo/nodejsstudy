var express =require('express');
var app =express();
var bodyParser=require('body-parser');
var fs= require('fs');

app.locals.pretty = true;
app.use(bodyParser.urlencoded({extended: false}));
app.set('views','./views');
app.set('view engine','jade');

app.get('/topic/new',function(req,res){
  res.render('jade');
;})

app.get(['/topic','/topic/:id'],function(req,res){
  fs.readdir('data',function(err, files){
    if(err){
      console.log(err);
      res.status(500).send('Internal Sever Error');
    }
    var id = req.params.id;
    if(id){
      fs.readFile('data/'+id,'utf8',function(err, data){
        if(err){
          console.log(err);
          res.status(500).send('Internal Sever Error');
        };
        res.render('jade2',{topics:files, title:id, description:data});
      });
    }else{
      res.render('jade2',{topics:files,title:'Welcome',description:'Hello,world'});
    }
  });
});
/*
app.get('/topic/:id',function(req, res){
  var id = req.params.id;
  fs.readdir('data',function(err, files){
    if(err){
      console.log(err);
      res.status(500).send('Internal Sever Error');
    }
    fs.readFile('data/'+id,'utf8',function(err, data){
      if(err){
        console.log(err);
        res.status(500).send('Internal Sever Error');
      };
      res.render('jade2',{topics:files, title:id, description:data});
    });
  });
});
*/
app.post('/topic',function(req,res){
  var title = req.body.title;
  var description=req.body.description;
  fs.writeFile('data/'+title,description,function(err){
    if(err){
      console.log(err);
      res.status(500).send('Internal Sever Error');
    }
    res.send('Success');
  });

});

app.listen(3333,function(){
  console.log('conneted,3333port');
});
