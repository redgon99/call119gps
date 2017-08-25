//window.onload = initdust;

function initData(str) {
    document.getElementById('spinIcon').style.display = ""; //스피너 시작
    var str1 = localStorage.getItem("staddr1"); 
    var str2 = localStorage.getItem("staddr2");
    var str3 = localStorage.getItem("lat");
    var str4 = localStorage.getItem("lon");
    var str5 = localStorage.getItem("diameter");
    var str6 = localStorage.getItem("divlvl");
    var str7 = localStorage.getItem("stext");
    var zlevel;
    var cradius;
    getData(str1, str2, str3, str4, str5, str6, str7); // 미세먼지정보 수집 시
}

//http://localhost/119app/www/res.asp?str1=%EA%B0%95%EC%9B%90%EB%8F%84&str2=%EC%B6%98%EC%B2%9C%EC%8B%9C&str3=37.87&str4=127.73
function getData(str1, str2, str3, str4, str5, str6, str7) {
    var currentInfowindow = null;
    var nowDate = new Date();
    var nowHour = nowDate.getHours();
    if(nowHour < 10){
        nowHour = '0' + nowHour;
    }
    var nowMin = nowDate.getMinutes()
    if(nowMin < 10){
        nowMin = '0' + nowMin;
    }
    var nowTime = nowHour.toString() + nowMin.toString();
    //nowTime = '1300'
    //console.log(nowTime)

    var url = 'http://119survey.org/119app/w/res.asp';
    //var url = 'res.asp';
    url += '?str1='+str1;
    url += '&str2='+str2;
    url += '&str3='+str3;
    url += '&str4='+str4;
    url += '&str5='+str5;
    url += '&str6='+str6;
    url += '&str7='+str7;
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
            var duty_flag
			var data = xmlhttp.responseText;
            //document.getElementById('hosTable').innerHTML = data;
            //callback(data);
            //alert(data);
            var strData = data.split('|');
            var strName = strData[1].split('^');
            var strAddr = strData[2].split('^');
            var strTel = strData[3].split('^');
            var strLat = strData[4].split('^');
            var strLon = strData[5].split('^');
            var strStime = strData[6].split('^');
            var strCtime = strData[7].split('^');
            var strDist = strData[8].split('^');

            //document.getElementById('hosTable').innerHTML = strName[0] + ' ' + strAddr[0] + ' ' + strTel[0] + ' ' + strLat[0] + ' ' + strLon[0] + '/n';
            var strLength = strAddr.length;

            if(strLength == 1) {
                alert('반경' + str5 + 'km내에 자료가 없습니다. 반경을 늘려주세요')
            }

            if(str5 == 0.3){
                zlevel = 16, cradius = 300;
            }
            if(str5 == 0.5){
                zlevel = 15, cradius = 500;
            }
            if(str5 == 1){
                zlevel = 14, cradius = 1000;
            }
            if(str5 == 3){
                zlevel = 13, cradius = 3000;
            }
            if(str5 == 5){
                zlevel = 12, cradius = 5000;
            }
            if(str5 == 50){
                zlevel = 11, cradius = 25000;
            }
            // 지도생성
            var mylatlan = new google.maps.LatLng(str3, str4);
            var mapOptions = {
                center: mylatlan,
                zoom:14,
                scaleControl: true,
                streetViewControl: false,
                gestureHandling: 'greedy',
                fullscreenControl: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

            // 반경 생성
            var cityCircle = new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 1,
                fillColor: '#FF0000',
                fillOpacity: 0.15,
                map: map,
                center: mylatlan,
                radius: 1000
                //radius: 100
            });

            //아이콘 설정
            var image = {
                url: 'images/pin_blue.png',
                size: new google.maps.Size(30, 51),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(10, 32),
                scaledSize: new google.maps.Size(20, 32)
            };

            var marker = new google.maps.Marker({
                position: mylatlan,
                animation: google.maps.Animation.DROP,
                map: map,
                title: '내위치',
                icon: image
            }); 

            
            // 검색된 의료기관 마커추가
            for(var i = 0; i < strLength + 1; i ++) { 
                var hPos = {lat: strLat[i]*1 , lng: strLon[i]*1};

                var images = {
                    url: 'images/pin_grey.png',
                    size: new google.maps.Size(30, 51),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(10, 32),
                    scaledSize: new google.maps.Size(20, 32)
                };

                if(nowTime > strStime[i] && nowTime < strCtime[i]){ // 근무시간 유무 확인
                    var marker = 'marker' + i
                        marker = new google.maps.Marker({
                        position: hPos,
                        animation: google.maps.Animation.DROP,
                        map: map,
                        title: i+'^'+strName[i]
                    });
                    
                }
                else{ //근무시간이 아니면 회색 마커 생성
                    var marker = 'marker' + i 
                        marker = new google.maps.Marker({
                        position: hPos,
                        animation: google.maps.Animation.DROP,
                        map: map,
                        title: i+'^'+strName[i],
                        icon: images
                    });
                }

                marker.addListener('click', function() { // 의료기관 마커를 클릭하면 실행
                    var idxStr = this.title; 
                    idxStr = idxStr.split('^');
                    idxStr = idxStr[0];

                    if(nowTime > strStime[idxStr] && nowTime < strCtime[idxStr]){ // 근무시간중이면 실행
                        duty_flag = 0;
                    }
                    else{
                        duty_flag = 1;
                    }

                    if (strDist[idxStr] < 1){ // 거리가 1키로 미만이면 미터로 이상이면 킬로미터로 표시
                        var DDist = strDist[idxStr] * 1000 + 'm';
                    }
                    else{
                        var DDist = strDist[idxStr] + 'km';
                    }

                    if(duty_flag == 1){ 
                        var Hname = strName[idxStr]+"(근무종료)";
                    }
                    else{
                        var Hname = strName[idxStr];
                    }
                    contentString = '<div style="color:blue" id="icontent">'+
                        '<div id="siteNotice">'+
                        '</div>'+
                        '<h4>' + Hname + '</h4>'+
                        '<div id="bodyContent">'+
                        '<p><b>주소</b> : ' + strAddr[idxStr] + '</p>'+
                        '<p><b>TEL</b> : ' + strTel[idxStr] + '  ' + '<a href="tel:' + strTel[idxStr] + '">전화 걸기</a>' + '</p>'+
                        '<p><b>근무시간</b> : ' + strStime[idxStr] + '~' + strCtime[idxStr] + '</p>'+
                        '<p><b>직선거리</b> : ' + DDist + '</p>'+
                        '<div>' +
                        '<img onclick="kakaonavi('+ "'" + strName[idxStr] + "','" + strLat[idxStr] + "','" + strLon[idxStr] + "'" + ')"' +
                        ' src="https://dev.kakao.com/assets/img/about/buttons/navi/kakaonavi_btn_medium.png" width="20%">' + 
                        '<br>' + '<b>길안내</b>' +
                        '</div>' +
                        '</div>'+
                        '</div>';

                    var iPos = {lat: strLat[idxStr]*1 , lng: strLon[idxStr]*1};

                    if(currentInfowindow != null) {
                        currentInfowindow.close();
                    }
                    var infowindowh = new google.maps.InfoWindow({
                        content: contentString,
                        position: iPos,
                        zindex:2
                    });
                    infowindowh.open(map);
                    currentInfowindow = infowindowh;
                
                    if(duty_flag == 1){ // 근무시간이 아니면 글자색을 회색으로 표출
                        document.getElementById('icontent').style.color = 'grey';
                    }



                });
                document.getElementById('spinIcon').style.display = "none"; //스피너 종료

            }
		}
	};
	xmlhttp.open("GET",url, true);
	xmlhttp.send();
    localStorage.setItem("stext",'');
}

//길안내 카카오네비 연동
function kakaonavi(phname,xCoor,yCoor){
    //alert(phname + xCoor + yCoor)
    url = "https://119survey.org/119app/w/navi.asp"
    url = url + "?phname=" + "'" + phname + "'"
    //url = url + "?phname=" + phname +
    url = url + '&xCoor=' + xCoor
    url = url + '&yCoor=' + yCoor
    //console.log(url)
    window.open(url)
}

function kakaoNavi(phname,xCoor,yCoor){
    //alert('adsfasdf');
    // 사용할 앱의 JavaScript 키를 설정해 주세요.
    Kakao.init('80a32a394e1978a52dfe542d105ccb1f');
    // 카카오 로그인 버튼을 생성합니다.
    Kakao.Navi.start({
        name: phname,
        x: yCoor,
        y: xCoor,
        coordType: 'wgs84'
    });

}