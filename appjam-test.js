var request=require('request');
var urlencode=require('urlencode');
var address='개포동';
var sl_adress=address;
sl_adress=urlencode(sl_adress);

var sl_options={
  url : 'https://openapi.naver.com/v1/map/geocode?encoding=utf-8&coordType=latlng&query=%EB%B6%88%EC%A0%95%EB%A1%9C%206',
  host: 'openapi.naver.com',
  headers :{
  'Accept': '*/*',
  'Content-Type': 'application/json',
  'X-Naver-Client-Id': 'TTWUuECzU4KaBo1_FIrH',
  'X-Naver-Client-Secret': 'B1wPHsGSGA'
  }
}
function sl_callback(err,res,body){
  if(!err&& res.statusCode===200){
    var addressdata=JSON.parse(body);
    addressdata=res.body;
    console.log(addressdata.result.items[3].point.x);
    // var xpoint=addressdata.items[0].point.x;
    // var ypoint=addressdata.items[0].point.y;

    console.log(addressdata.items);
  } else {
    console.log('naver_address_select : '+err);
  }
}

request(sl_options, sl_callback);
