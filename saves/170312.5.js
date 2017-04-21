var express= require('express');
var bodyParser= require('body-parser');
var app= express();
var port=1222;
app.locals.pretty = true;
app.set('view engine','jade');
app.set('views','./views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.get('/form',function(req, res){
  res.render('form');
});

app.get('/form_receiver',function(req, res){
  var title =req.query.title;
  var description =req.query.description;
  res.send(title+','+description);
});

app.post('/form_receiver', function(req, res){
  var title= req.body.title;
  var description= req.body.description;
  res.send(title+','+description);
});

app.get('/topic:id',function(req, res){
  var topics=[
    'javascript is ...',
    'Nodejs is ...',
    'Express is ...'
  ];
var output=`
<a href='/topic?id=0'>javascript</a><br>
<a href='/topic?id=1'>Nodejs</a><br>
<a href='/topic?id=2'>express</a><br><br>
${topics[req.params.id]}
`
  res.send(output);
});
app.get('/template',function(req, res){
  res.render('temp',{time:Date(), title:'Jade'});
});
app.listen(port,function(){
  console.log("Connet "+port+" port !");
});
