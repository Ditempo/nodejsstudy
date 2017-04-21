var http=require('http');
var path=require('path');
var express= require('express');
var cookieParser=require('cookie-parser');
var app=express();
var port=1222;
var host='10.156.145.122'
app.use(cookieParser('146454##$@#$%%sdfsd'));

var products={
  1:{title:'THe history'},
  2:{title:'The next'}
};
app.get('/cart',function(req, res){
  var cart=req.cookies.cart;
  if(!cart){
    res.rennd('Empty');
  } else {
    var output='';
    for(var id in cart){
      output+= `<li>${products[id].title}(${cart[id]})</li>`
    }
  }
  res.send(`<h1>cart</h1><ul>${output}</ul><a href='/products'>produts list</a>`);
})
app.get('/products',function(req,res){
  var output='';
  for( var name in products){
    output+=`
    <li>
      <a href="/cart/${name}">${products[name].title}</a>
    </li>`
  }
  res.send(`<h1>Products</h1>
    <ul>${output}</ul>
    <a href="/cart">Cart</a>`);
});

app.get('/cart/:id',function(req,res){
  var id= req.params.id;
  if(req.cookies.cart){
    var cart=req.cookies.cart;
  } else {
    var cart={};
  }
  if(!cart[id]){
    cart[id]=0;
  }
  cart[id] = parseInt(cart[id])+1;
  res.cookie('cart',cart);
  res.send(cart);
  res.redirect('/cart');
})

app.get('/count',function(req, res){
  if(req.cookies.count){
    var count= parseInt(req.cookies.count);
  } else {
    var count= 0;
  }
  count= count+1;
  res.cookie('count', count);
  res.send('count : '+count);
});

app.listen(port, host, function(){
  console.log('http://'+host+':'+port);
});
