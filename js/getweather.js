//window.onload = initweather;

function initweather(){
    var localLat = localStorage.getItem("lat"); 
    var localLon = localStorage.getItem("lon");
    if(localLat == '') {
        //alert('geolocation')
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(locationSuccess, locationError, geo_options);
            //navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
        }else{
            console.log("지오 로케이션 없음");
        }
    }
    else{
        var rs = dfs_xy_conv("toXY",localLat,localLon);
        // 위도/경도 -> 기상청 좌표x / 좌표 y 변환
        xml2jsonCurrentWth(rs.nx, rs.ny);
    }
}

function locationSuccess(p){
    //var latitude = 34.480367,  longitude = 126.583017;
    var latitude = p.coords.latitude, longitude = p.coords.longitude;
    var rs = dfs_xy_conv("toXY",latitude,longitude);
    // 위도/경도 -> 기상청 좌표x / 좌표 y 변환
    xml2jsonCurrentWth(rs.nx, rs.ny);
}
// locationSuccess

function locationError(error){
        var errorTypes = {
            0 : "무슨 에러냥~",
            1 : "허용 안눌렀음",
            2 : "위치가 안잡힘",
            3 : "응답시간 지남"
        };
        var errorMsg = errorTypes[error.code];
        console.log(errorMsg)
}
    // locationError

var geo_options = {
    enableHighAccuracy: true,
    maximumAge        : Infinity ,
    timeout           : Infinity
};

// geo_options  LCC DFS 좌표변환을 위한 기초 자료
var RE = 6371.00877; // 지구 반경(km)
var GRID = 5.0; // 격자 간격(km)
var SLAT1 = 30.0; // 투영 위도1(degree)
var SLAT2 = 60.0; // 투영 위도2(degree)
var OLON = 126.0; // 기준점 경도(degree)
var OLAT = 38.0; // 기준점 위도(degree)
var XO = 43; // 기준점 X좌표(GRID)
var YO = 136; // 기1준점 Y좌표(GRID)

    // LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )
function dfs_xy_conv(code, v1, v2) {
    var DEGRAD = Math.PI / 180.0;
    var RADDEG = 180.0 / Math.PI;

    var re = RE / GRID;
    var slat1 = SLAT1 * DEGRAD;
    var slat2 = SLAT2 * DEGRAD;
    var olon = OLON * DEGRAD;
    var olat = OLAT * DEGRAD;

    var sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
    var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = re * sf / Math.pow(ro, sn);
    var rs = {};
    if (code == "toXY") {

        rs['lat'] = v1;
        rs['lng'] = v2;
        var ra = Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5);
        ra = re * sf / Math.pow(ra, sn);
        var theta = v2 * DEGRAD - olon;
        if (theta > Math.PI) theta -= 2.0 * Math.PI;
        if (theta < -Math.PI) theta += 2.0 * Math.PI;
        theta *= sn;
        rs['nx'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
        rs['ny'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
    }
    else {
        rs['nx'] = v1;
        rs['ny'] = v2;
        var xn = v1 - XO;
        var yn = ro - v2 + YO;
        ra = Math.sqrt(xn * xn + yn * yn);
        if (sn < 0.0) - ra;
        var alat = Math.pow((re * sf / ra), (1.0 / sn));
        alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

        if (Math.abs(xn) <= 0.0) {
            theta = 0.0;
        }
        else {
            if (Math.abs(yn) <= 0.0) {
                theta = Math.PI * 0.5;
                if (xn < 0.0) - theta;
            }
            else theta = Math.atan2(xn, yn);
        }
        var alon = theta / sn + olon;
        rs['lat'] = alat * RADDEG;
        rs['lng'] = alon * RADDEG;
    }
    return rs;
}
// dfs_xy_conv

function xml2jsonCurrentWth(nx, ny){
    //console.log(nx);
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    //console.log("time " + minutes)

    if(minutes < 30){
        // 30분보다 작으면 한시간 전 값
        hours = hours - 1;
        if(hours < 0){
            // 자정 이전은 전날로 계산
            today.setDate(today.getDate() - 1);
            dd = today.getDate();
            mm = today.getMonth()+1;
            yyyy = today.getFullYear();
            hours = 23;
        }
    }
    if(hours<10) {
        hours='0'+hours
    }
    if(mm<10) {
        mm='0'+mm
    }
    if(dd<10) {
        dd='0'+dd
    } 

    var _nx = nx,
    _ny = ny,
    apikey = "%2BZq7dxKT0cfFmKH%2FR4tzVOPbDXvAARBc2Zz2EZuZzvYa4zlJahyfz07VutJrxsQRDZirz3WTHQxo15GtdGSlww%3D%3D",
    today = yyyy+""+mm+""+dd,
    basetime = hours + "00",
    fileName = "http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastGrib";
    fileName += "?ServiceKey=" + apikey;
    fileName += "&base_date=" + today;
    fileName += "&base_time=" + basetime;
    fileName += "&nx=" + _nx + "&ny=" + _ny;
    fileName += "&pageNo=1&numOfRows=10";
    fileName += "&_type=json";
    //console.log(fileName);

    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var tt = xmlhttp.responseText;
            //  alert(tt);
            //console.log(tt);
            var obj = JSON.parse(tt);
            //document.getElementById("timeNow").innerHTML = obj.response.body.items.item[4].baseTime.toString().substr(0,2) + '시 현재, ';
            var temp = obj.response.body.items.item[5].obsrValue;
            //temp = 18
            document.getElementById("temp").innerHTML = temp  + '℃';

            if (temp < -5) { //  기온이 -5이하면 동상정보 표출
                document.getElementById('frostbite').style.display='block'; 
            }

            // 강수형태(PTY) 코드 : 없음(0), 비(1), 비/눈(2), 눈(3)
            var pty = obj.response.body.items.item[1].obsrValue;
            switch(pty*1){
                case 0: 

                // 하늘상태(SKY) 코드 : 맑음(1), 구름조금(2), 구름많음(3), 흐림(4)
                var ns = obj.response.body.items.item[4].obsrValue;
                var skyStatus = '';
                switch(ns){
                    case 1: skyStatus = '맑음'; document.getElementById("skypic").src='images/c3/clear.png' ;break;
                    case 2: skyStatus = '구름조금'; document.getElementById("skypic").src='images/c3/partly-cloudy.png' ;break;
                    case 3: skyStatus = '구름많음'; document.getElementById("skypic").src='images/c3/cloudy_s_sunny.png' ;break;
                    case 4: skyStatus = '흐림'; document.getElementById("skypic").src='images/c3/cloudy.png' ;break;
                }
                break; 
                case 1: skyStatus = '비'; document.getElementById("skypic").src='images/c3/rain.png' ;break;
                case 2: skyStatus = '짓눈개비'; document.getElementById("skypic").src='images/c3/sleet.png' ;break;
                case 3: skyStatus = '눈'; document.getElementById("skypic").src='images/c3/snow.png' ;break;
            }

            document.getElementById("timeNow").innerHTML = obj.response.body.items.item[4].baseTime.toString().substr(0,2) + '시 현재, ' + skyStatus ;   

            var humivalue = obj.response.body.items.item[2].obsrValue; //습도값
            //humivalue = 25
            document.getElementById("humiduty").innerHTML = '습도 : '  + humivalue + '%';

            // 습도가 낮고(30미만) 해당월이 2,3,4,5월이면 산불주의 메뉴얼 표출
            //month = 3
            if(2==month || 3==month || 4==month || 5==month){ 
                if(humivalue < 30){ 
                    document.getElementById("humi").style.display = 'block';
                }
            }

            //습도가 50이상 높고 온도가 30도이상 높으면 열손상 주의
            if(temp >=30) {
                document.getElementById("hotemper").style.display = 'block';
            }

            //강수량 1시간동안 내린 비의 양 
            var rain = obj.response.body.items.item[3].obsrValue;
            if(rain == 0){
                document.getElementById("rain").innerHTML =  '강수랑 : -';
            }
            else{
                document.getElementById("rain").innerHTML =  '강수량 : ' + rain + 'mm';
            }

            // 풍향계산 (풍향값 + 22.5 * 0.5) / 22.5) = 변환값(소수점 이하 버림)
            var wcValue = ((obj.response.body.items.item[7].obsrValue + 22.5 * 0.5)/22.5).toFixed(0);
            // 풍속값
            var wsValue = obj.response.body.items.item[9].obsrValue;
            //강풍이 불면 표출 강풍주의 메뉴얼 표출
            //wsValue = 15
            if(wsValue >= 10 ){
                document.getElementById("bigwind").style.display = 'block'; 
            }

            var windObj = document.getElementById('wind');
            //wcValue = 3
            switch(wcValue*1){
                case 0: windObj.innerHTML = '바람 : ' + wsValue + 'm/s <b>N</b>' ; break ;
                case 1: windObj.innerHTML = '바람 : ' + wsValue + 'm/s <b>NNE</b>' ; break ;
                case 2: windObj.innerHTML = '바람 : ' + wsValue + 'm/s <b>NE</b>' ; break ;
                case 3: windObj.innerHTML = '바람 : ' + wsValue + 'm/s <b>ENE</b>' ; break ;
                case 4: windObj.innerHTML = '바람 : ' + wsValue + 'm/s <b>E</b>' ; break ;
                case 5: windObj.innerHTML = '바람 : ' + wsValue + 'm/s <b>ESE</b>' ; break ;
                case 6: windObj.innerHTML = '바람 : ' + wsValue + 'm/s <b>SE</b>' ; break ;
                case 7: windObj.innerHTML = '바람 : ' + wsValue + 'm/s <b>SSE</b>' ; break ;
                case 8: windObj.innerHTML = '바람 : ' + wsValue + 'm/s <b>S</b>' ; break ;
                case 9: windObj.innerHTML = '바람 : ' + wsValue + 'm/s <b>SSW</b>' ; break ;
                case 10: windObj.innerHTML = '바람 : ' + wsValue + 'm/s <b>SW</b>' ; break ;
                case 11: windObj.innerHTML = '바람 : ' + wsValue + 'm/s <b>WSW</b>' ; break ;
                case 12: windObj.innerHTML = '바람 : ' + wsValue + 'm/s <b>W</b>' ; break ;
                case 13: windObj.innerHTML = '바람 : ' + wsValue + 'm/s <b>WNW</b>' ; break ;
                case 14: windObj.innerHTML = '바람 : ' + wsValue + 'm/s <b>NW</b>' ; break ;
                case 15: windObj.innerHTML = '바람 : ' + wsValue + 'm/s <b>NNW</b>' ; break ;
                case 16: windObj.innerHTML = '바람 : ' + wsValue + 'm/s <b>N' ; break ;
            }
        }
    };

    //xmlhttp.open("GET","weather.asp?str=" + today + "&str1=" + basetime + "&str2=" + _nx + "&str3=" + _ny, true);
    xmlhttp.open("GET",fileName, true);
    xmlhttp.send();
}

