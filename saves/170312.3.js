var fs= require('fs');
console.log(1);
var data= fs.readFileSync('data.test',{encoding:'utf8'});
console.log(data);

console.log(2);
fs.readFile('data.txt',{encoding:'utf8'},function(err,data){
  console.log(3);
  console.log(data);
});
console.log(4);
