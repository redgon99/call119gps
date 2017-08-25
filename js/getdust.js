//window.onload = initdust;

function initdust() {
    var localLat = localStorage.getItem("lat"); 
    var localLon = localStorage.getItem("lon");

//        localLat = 37.885231;
//        localLon = 127.729832;

    getPm10Info(localLat, localLon); // 미세먼지정보 수집 시작
}

function getTmPointFromWgs84(key, y, x, callback) {
    var url = 'https://apis.daum.net/local/geo/transcoord';
    url += '?apiKey='+key;
    url += '&fromCoord=WGS84';
    url += '&x='+x;
    url += '&y='+y;
    url += '&toCoord=TM';
    url += '&output=json';
    //console.log(url);

	var xmlhttp;
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	}
	else {// code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var data = xmlhttp.responseText;
            callback(data);
		}
	};
	xmlhttp.open("GET",url, true);
	xmlhttp.send();
}

function getNearbyMsrstn(key, my, mx, callback)  {
    var DOMAIN_ARPLTN_KECO = 'http://openapi.airkorea.or.kr/openapi/services/rest';
    var PATH_MSRSTN_INFO_INQIRE_SVC = 'MsrstnInfoInqireSvc';
    var NEAR_BY_MSRSTN_LIST = 'getNearbyMsrstnList';

    var url = DOMAIN_ARPLTN_KECO + '/' + PATH_MSRSTN_INFO_INQIRE_SVC + '/' + NEAR_BY_MSRSTN_LIST +
        '?ServiceKey='+key +
        '&tmY='+my +
        '&tmX='+mx +
        '&pageNo='+ 1 +
        '&numOfRows='+999+
        '&_returnType=json';

        //console.log(key)

    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var data = xmlhttp.responseText;
            callback(data);
        }
    };
    xmlhttp.open("GET",url, true);
    xmlhttp.send();
}

function getMsrstnAcctoRltmMesureDnsty(key, stationName, callback) {
    var url = 'http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc' +
        '/getMsrstnAcctoRltmMesureDnsty' +
        '?ServiceKey='+key +
        '&stationName='+stationName+
        '&dataTerm=DAILY'+
        '&pageNo='+ 1 +
        '&numOfRows='+999+
        '&_returnType=json';

        //console.log(url)
    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var data = xmlhttp.responseText;
            callback(data);
        }
    };
    xmlhttp.open("GET",url, true);
    xmlhttp.send();
}

function getPm10Info(lat, long) {
    //getTmPointFromWgs84('33ada8d8d515221f688e0d24225b7063', lat, long, function (err, data) {
    getTmPointFromWgs84('33ada8d8d515221f688e0d24225b7063', lat, long, function (data) {

        var data = JSON.parse(data);

        //console.log(data);
        var key = '%2BZq7dxKT0cfFmKH%2FR4tzVOPbDXvAARBc2Zz2EZuZzvYa4zlJahyfz07VutJrxsQRDZirz3WTHQxo15GtdGSlww%3D%3D';
        //getNearbyMsrstn(key, data.y, data.x, function (err, data) {
        getNearbyMsrstn(key, data.y, data.x, function (data) {

            var ret = JSON.parse(data);
            //console.log(ret);
            //var stationname = ret.response.body.items.item[0].stationname;
            var stationname = ret.list[0].stationName;
            var addr = ret.list[0].addr
            var tm = ret.list[0].tm
            //document.getElementById('station_name').innerHTML = '관측소명 : ' + stationname;
            //document.getElementById('addr').innerHTML = '주소 : ' + addr;
            //document.getElementById('dist').innerHTML = '거리 : ' + tm;

            //console.log(stationname);
            getMsrstnAcctoRltmMesureDnsty(key, stationname, function (data) {
                var ret = JSON.parse(data);
                //console.log(ret)
                var pm10value = ret.list[0].pm10Value; 
                var pm10Grade = ret.list[0].pm10Grade1h;
                switch(pm10Grade*1){
                    case 1: 
                        document.getElementById('pm10').innerHTML = pm10value + '㎍' + '<br>' + ' 좋음';
                        document.getElementById('pm10').className = "w3-round w3-samll w3-center w3-container w3-cell w3-blue";
                        break;
                    case 2: 
                        document.getElementById('pm10').innerHTML = pm10value + '㎍' + '<br>' + ' 보통';
                        document.getElementById('pm10').className = "w3-round w3-center w3-container w3-cell w3-green";
                        break;
                    case 3:
                        document.getElementById('pm10').innerHTML = pm10value + '㎍' + '<br>' + ' 나쁨';
                        document.getElementById('pm10').className = "w3-round w3-center w3-container w3-cell w3-yellow";
                        document.getElementById('dust').style.display = 'block';
                        break;
                    case 4:
                        document.getElementById('pm10').innerHTML = pm10value + '㎍' + '<br>' + ' 매우나쁨';
                        document.getElementById('pm10').className = "w3-round w3-center w3-container w3-cell w3-red";
                        document.getElementById('dust').style.display = 'block';
                        break;
                }
                var pm25value = ret.list[0].pm25Value;
                var pm25Grade = ret.list[0].pm25Grade;
                switch(pm25Grade*1){
                    case 1: 
                        document.getElementById('pm25').innerHTML = pm25value + '㎍' + '<br>' + ' 좋음';
                        document.getElementById('pm25').className = "w3-round w3-center w3-container w3-cell w3-blue";
                        break;
                    case 2: 
                        document.getElementById('pm25').innerHTML = pm25value + '㎍' + '<br>' + ' 보통';
                        document.getElementById('pm25').className = "w3-round w3-center w3-container w3-cell w3-green";
                        break;
                    case 3:
                        document.getElementById('pm25').innerHTML = pm25value + '㎍' + '<br>' + ' 나쁨';
                        document.getElementById('pm25').className = "w3-round w3-center w3-container w3-cell w3-yellow";
                        document.getElementById('dust').style.display = 'block';
                        break;
                    case 4:
                        document.getElementById('pm25').innerHTML = pm25value + '㎍' + '<br>' + ' 매우나쁨';
                        document.getElementById('pm25').className = "w3-round w3-center w3-container w3-cell w3-red";
                        document.getElementById('dust').style.display = 'block';
                        break;
                }
            });
        });
    });
}