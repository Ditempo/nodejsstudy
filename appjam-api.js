
var express = require('express');
var router = express.Router();
var request = require("request");
  //날씨 api 객체
  var pushlon=37.763619;
  var pushlat=37.763619;
  var location = {
    lon : pushlon,
    //126.9658000000,
    lat : pushlat,
    //37.5714000000,
    city : "",
    county : "",
    village : ""
    // lon : locationpush.lon,
    // //126.9658000000,
    // lat : locationpush.lat,
    // //37.5714000000,
    // city : locationpush.city,
    // county : locationpush.county,
    // village : locationpush.village
  }

  //날씨 qpi 블러오기 및 실행
  var weatherreqdata= {
    tmax : '', //현날짜 최고온
    tmin : '', //현날짜 최소온
    tc : '', //현온
    skyname : '', // 현 날씨
    dust : '', //미세 먼지
    current : '', // 불쾌지수
    slice:  [ //단기 날씨
      {  slice_today_2 : ''},
      {    slice_today_5 : ''},
      {    slice_today_8 : ''},
      {    slice_today_11 : ''},
      {    slice_today_14 : ''},
      {    slice_today_17 : ''},
      {    slice_today_20 : ''},
      {    slice_today_23 : ''},
      {  slice_tomorrow_2 : ''},
      {  slice_tomorrow_5 : ''},
      {    slice_tomorrow_8 : ''},
      {    slice_tomorrow_11 : ''},
      {  slice_tomorrow_14 : ''},
      {    slice_tomorrow_17 : ''},
      {  slice_tomorrow_20 : ''},
      {    slice_tomorrow_23 : ''
      }
    ]
  }

  var wh_options = {
    url : 'http://apis.skplanetx.com/weather/current/hourly?lon='+location.lon+'&village='+location.village+'&county='+location.county+'&lat='+location.lat+'&city='+location.city+'&version=1',
    headers: {
      "x-skpop-userId": 'hyeonjinmirim@e-mirim.hs.kr',
      "Accept-Language": 'ko_KR',
      "Date": 'Sat Apr 01 17:31:22 KST 2017',
      "Accept": 'application/json',
      "access_token": "",
      "appKey": '3dc8057d-b355-3309-aab2-82ecacfda013'
    }
  }
  function wh_callback(err,res,body){
    if(!err&& res.statusCode===200){
      var weatherdata=res.body;
      weatherdata = JSON.parse(res.body);
      weatherreqdata.tmax=weatherdata.weather.hourly[0].temperature.tmax;
      weatherreqdata.tmin=weatherdata.weather.hourly[0].temperature.tmin;
      weatherreqdata.tc=weatherdata.weather.hourly[0].temperature.tc;
      weatherreqdata.skyname=weatherdata.weather.hourly[0].sky.name;
      console.log('현 최고온도'+weatherreqdata.tmax);
      console.log('현 최소온도'+weatherreqdata.tmin);
      console.log('현 온도'+weatherreqdata.tc);
      console.log('현 날씨:'+weatherreqdata.skyname);
    } else {
      console.log('now : '+err);
    }
  }
  request(wh_options, wh_callback);
  //미세먼지 농도 체크
  var pm_options = {
    url : 'http://apis.skplanetx.com/weather/dust?version=1&lat='+location.lat+'&lon='+location.lon,
    headers: {
      "x-skpop-userId": 'hyeonjinmirim@e-mirim.hs.kr',
      "Accept-Language": 'ko_KR',
      "Date": 'Sat Apr 01 17:31:22 KST 2017',
      "Accept": 'application/json',
      "access_token": "",
      "appKey": '3dc8057d-b355-3309-aab2-82ecacfda013'
    }
  }

  function pm_callback(err,res,body){
    if(!err&& res.statusCode===200){
      var pmdata=res.body;
      pmdata = JSON.parse(res.body);
      weatherreqdata.dust=pmdata.weather.dust[0].pm10.grade;
      console.log('미세먼지'+weatherreqdata.dust);
    } else {
      console.log('dust : '+err);
    }
  }
  request(pm_options, pm_callback);
  //불쾌지수
  var cu_options = {
    url : 'http://apis.skplanetx.com/weather/windex/thindex?version=1&lat='+location.lat+'&lon='+location.lon,
    headers: {
      "x-skpop-userId": 'hyeonjinmirim@e-mirim.hs.kr',
      "Accept-Language": 'ko_KR',
      "Date": 'Sat Apr 01 17:31:22 KST 2017',
      "Accept": 'application/json',
      "access_token": "",
      "appKey": '3dc8057d-b355-3309-aab2-82ecacfda013'
    }
  }

  function cu_callback(err,res,body){
    if(!err&& res.statusCode===200){
      var cudata=res.body;
      cudata = JSON.parse(res.body);
      weatherreqdata.current=cudata.weather.wIndex.thIndex[0].current.index;
      console.log('불쾌지수'+weatherreqdata.current);
    } else {
      console.log('current : '+err);
    }
  }
  request(cu_options, cu_callback);
  //단기예보
  var st_options = {
    // +'&foretxt=Y'
    url : 'http://apis.skplanetx.com/weather/forecast/3days?version=1&lat='+location.lat+'&lon='+location.lon+'&city='+location.city+'&county='+location.county+'&village='+location.village,
    headers: {
      "x-skpop-userId": 'hyeonjinmirim@e-mirim.hs.kr',
      "Accept-Language": 'ko_KR',
      "Date": 'Sat Apr 01 17:31:22 KST 2017',
      "Accept": 'application/json',
      "access_token": "",
      "appKey": '3dc8057d-b355-3309-aab2-82ecacfda013'
    }
  }

  function st_callback(err,res,body){

    if(!err&& res.statusCode===200){
      var stdata=res.body;
      stdata = JSON.parse(res.body);
      weatherreqdata.slice[0]=stdata.weather.forecast3days[0].fcst3hour.sky.name4hour;
      weatherreqdata.slice[1]=stdata.weather.forecast3days[0].fcst3hour.sky.name7hour;
      weatherreqdata.slice[2]=stdata.weather.forecast3days[0].fcst3hour.sky.name10hour;
      weatherreqdata.slice[3]=stdata.weather.forecast3days[0].fcst3hour.sky.name13hour;
      weatherreqdata.slice[4]=stdata.weather.forecast3days[0].fcst3hour.sky.name16hour;
      weatherreqdata.slice[5]=stdata.weather.forecast3days[0].fcst3hour.sky.name19hour;
      weatherreqdata.slice[6]=stdata.weather.forecast3days[0].fcst3hour.sky.name22hour;
      weatherreqdata.slice[7]=stdata.weather.forecast3days[0].fcst3hour.sky.name25hour;
      weatherreqdata.slice[8]=stdata.weather.forecast3days[0].fcst3hour.sky.name28hour;
      weatherreqdata.slice[9]=stdata.weather.forecast3days[0].fcst3hour.sky.name31hour;
      weatherreqdata.slice[10]=stdata.weather.forecast3days[0].fcst3hour.sky.name34hour;
      weatherreqdata.slice[11]=stdata.weather.forecast3days[0].fcst3hour.sky.name37hour;
      weatherreqdata.slice[12]=stdata.weather.forecast3days[0].fcst3hour.sky.name40hour;
      weatherreqdata.slice[13]=stdata.weather.forecast3days[0].fcst3hour.sky.name43hour;
      weatherreqdata.slice[14]=stdata.weather.forecast3days[0].fcst3hour.sky.name46hour;
      weatherreqdata.slice[15]=stdata.weather.forecast3days[0].fcst3hour.sky.name49hour;
      for(var i=0;i<weatherreqdata.slice.length-1;i++){
        console.log('단기예보 : '+weatherreqdata.slice[i]);
      }
    } else {
      console.log('3dsys'+err);
    }
  };

  request(st_options, st_callback);

module.exports = router;
