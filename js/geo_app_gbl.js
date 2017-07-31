window.onload = init;

function init() 
{
	var map; 
    var marker;
		
   if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showLocation, errorCallback);
   } else {
        document.getElementById('message01').innerHTML='현재 브라우저가 Geolocation을 지원하지 않습니다.';
   }
   
   function errorCallback(error) {
        var errorMessage;
		switch(error.code)
		{
		   case error.PERMISSION_DENIED:
		       errorMessage = "GPS(위치정보)를 활성화 해주세요";
			   break;
		   case error.POSITION_UNAVAILABLE:
		       errorMessage = "GPS(위치정보)를 활성화 해주세요";
			   break;
		   case error.TIMEOUT:
		       errorMessage = "GPS(위치정보)를 활성화 해주세요";
			   break;
	       default:
		       errorMessage = "알 수 없는 에러가 발생하였습니다.";
			   break;		   	   
		}
	document.getElementById('message01').innerHTML=errorMessage;
   }
   
   if(navigator.geolocation) {
        var watchId = navigator.geolocation.watchPosition(successCallback, errorCallback,
            {enableHighAccuracy: true,
			 timeout: 50000, 
			 maximumage: 60000});
        setTimeout(function() {
            navigator.geolocation.clearWatch(whatchId);
        }, 600000);
   } else {
        document.getElementById('message01').innerHTML = '현재 브라우저가 Geolocation을 지원하지 않습니다.';
   }
   
   function showLocation(position) { //최초 지도표시, 정밀하지 않은 위치 정확도
	    var mylatlan = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		var geocoder = new google.maps.Geocoder();
		
		
	   	var mapProp = {
			center: mylatlan,
			zoom:14,
			scaleControl: true,
			streetViewControl: false,
			mapTypeId: google.maps.MapTypeId.ROADMAP
  		};

  		var map = new google.maps.Map(document.getElementById("map_canvas"),mapProp);
		
		var marker = new google.maps.Marker({
		position: mylatlan,
	    animation: google.maps.Animation.DROP,
		map: map,
		title: 'Hello World!',
		});	
   }
        
   function successCallback(position) { //두번째 좌표정보, 정확한 정보를 수신
	    var mylatlan = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);		
		var geocoder = new google.maps.Geocoder();
		
		///////////////////////////////////////////////////
        if(map == undefined) { //지도 최초 생성
          var myOptions = {
            zoom: 15,
            center: mylatlan,
			scaleControl: true,
			streetViewControl: false,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.LARGE,
				position: google.maps.ControlPosition.LEFT_CENTER
			},			
            mapTypeId: google.maps.MapTypeId.ROADMAP
          }
          map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
        }
        else 
		map.panTo(mylatlan);
		
		if(marker == undefined){ //마커가 없으면 한번만 생성
			marker = new google.maps.Marker({  //마커생성
			position: mylatlan,
			map: map,
			title: 'Hello World!',
			});	
		}
		else {
			marker.setPosition(mylatlan); //마커를 새로운 좌표로 이동
		}

		var accunum = position.coords.accuracy;

		switch(true) {
  		case accunum >= 1000 : 
		 	document.getElementById("message01").innerHTML = ' 위치 찾기 준비중...';
		 	document.getElementById("message02").innerHTML = ' GPS가 꺼져있으면 켜주세요!';
			document.getElementById("send").style.color="#D5D5D5";
			break;
  		case accunum >= 100 :
		 	document.getElementById("message01").innerHTML = ' 정확한 위치를 찾는중...';
		 	document.getElementById("message02").innerHTML = ' GPS로부터 정확한 위치를 받는중입니다.!';
			document.getElementById("send").style.color="#A6A6A6";
			break;
  		case accunum >= 20 :
		 	document.getElementById("message01").innerHTML = ' 대강의 위치가 확인되었습니다.';
		 	document.getElementById("message02").innerHTML = ' 아래 119에 신고하기 버튼을 눌러주세요';
//		 	document.getElementById("aaa").innerHTML = '119에 신고하기';
			document.getElementById("send").style.color="#4C4C4C";
			break;
  		case accunum < 20 :
		 	document.getElementById("message01").innerHTML = ' 정확한 위치확인 완료!';
		 	document.getElementById("message02").innerHTML = ' 아래 119에 신고하기 버튼을 눌러주세요';
//		 	document.getElementById("aaa").innerHTML = '119에 신고하기';
//		 	document.getElementById("aaa").style.color="#33FF66";
			document.getElementById("send").style.color="black";
			break;
		}

		
		//역지오코딩으로 주소찾기----------------------------------------------
		geocoder.geocode({'latLng': mylatlan}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var vaddress = results[0].formatted_address;
				vaddress = vaddress.replace('대한민국','');
				vaddress = '주소 : '+vaddress.replace('한국','');
				document.getElementById('addr').innerHTML = vaddress;
    		}
  		});			
		// 화면에 데이터 표출	
        document.getElementById('latitude').innerHTML = '좌표 : 위도 '+position.coords.latitude.toFixed(6);
        document.getElementById('longitude').innerHTML = '경도 '+position.coords.longitude.toFixed(6);
        document.getElementById('altitude').innerHTML = '고도 : '+Number(position.coords.altitude).toFixed(0)+"m";
        document.getElementById('accuracy').innerHTML = '위치오차 : '+position.coords.accuracy.toFixed(0)+"m";	
    }		
	
 }  