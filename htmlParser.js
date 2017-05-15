var request = require("request");
var cheerio = require('cheerio') ;
var requestOptions = 
{ 
    method: "GET" ,
    uri: "http://www.airkorea.or.kr/dustForecast" ,
    headers: { 
        "User-Agent": "Mozilla/5.0" 
    } 
};
 
request(requestOptions, function(error, response, body) { 
    // 웹사이트 로드 
    $ = cheerio.load(body); 
    info_list = [] ;
    colspan_index = [] ;
    // 미세먼지 예보 정보를 가지고있는 첫번째 테이블을 확인 
    $('.table_04.mb10').first().find('tr').each(function (index, elem){
         // 지역 구분 입력 
         if(index == 0){ 
             $(this).find('th').each(function (index, elem) {
                info_list.push(
                    { 
                        "name" : $(this).text().trim()
                    }
                ) 
                if($(this).attr('colspan') == '2') { 
                    colspan_index.push(index); 
                    info_list.push(
                        {
                             "name" : $(this).text().trim() 
                        }
                    )
                } 
            }); 
        } 
        // 경기, 강원 구분 입력 
        if(index == 1){ 
            $(this).find('th').each(function (index, elem) {
                info = info_list[colspan_index[0] + index]; 
                info["name"] = info["name"] + " " + $(this).text();
                info_list[colspan_index[0] + index] = info;
             });
        }
        // 미세면지, PM10, PM2.5 데이터 입력 
        if(index >= 2){ 
            // text 만 구분하여 입력한다. 
            info_str = $(this).text().split("\n"); 
            info_index = 0 ;
            info_key = "" ;
            for(index in info_str) { 
                info = info_str[index].trim() ;
                if( info != "" ) { 
                    if (info_index == 0){ 
                        info_key = info ;
                    } else {
                        dust_info = info_list[info_index]; 
                        dust_info[info_key]	= info ;
                    } 
                    info_index++; 
                } 
            } 
        } 
    }); 
    // 결과 출력 
    for (index in info_list) { 
        console.log(info_list[index]) ;
    } 
}); 