window.onload = init;

function init() 
{
	var map; 
    var marker;
		
   if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showLocation, errorCallback);
   } else {
        document.getElementById('message01').innerHTML = 'Currently browser does not support Geolocation.';
   }
   
   function errorCallback(error) {
        var errorMessage;
		switch(error.code)
		{
		   case error.PERMISSION_DENIED:
		       errorMessage = "Please turn on GPS(location service)";
			   break;
		   case error.POSITION_UNAVAILABLE:
		       errorMessage = "Please turn on GPS(location service)";
			   break;
		   case error.TIMEOUT:
		       errorMessage = "Please turn on GPS(location service)";
			   break;
	       default:
		       errorMessage = "Encountered unknown error";
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
        document.getElementById('message01').innerHTML = 'Current browser is not supporting Geolocation.';
   }
   
   function showLocation(position) { //���� ����ǥ��, �������� ���� ��ġ ��Ȯ��
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
        
   function successCallback(position) { //�ι�° ��ǥ����, ��Ȯ�� ������ ����
	    var mylatlan = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);		
		var geocoder = new google.maps.Geocoder();
		
		///////////////////////////////////////////////////
        if(map == undefined) { //���� ���� ����
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
		
		if(marker == undefined){ //��Ŀ�� ������ �ѹ��� ����
			marker = new google.maps.Marker({  //��Ŀ����
			position: mylatlan,
			map: map,
			title: 'Hello World!',
			});	
		}
		else {
			marker.setPosition(mylatlan); //��Ŀ�� ���ο� ��ǥ�� �̵�
		}

		var accunum = position.coords.accuracy;

		switch(true) {
  		case accunum >= 1000 : 
		 	document.getElementById("message01").innerHTML = 'Preparing to search for location';
		 	document.getElementById("message02").innerHTML = 'Please turn on the GPS if is turned off';
			document.getElementById("send").style.color="#D5D5D5";
			break;
  		case accunum >= 100 :
		 	document.getElementById("message01").innerHTML = 'Searching for an exact location...';
		 	document.getElementById("message02").innerHTML = 'Receiving the exact location information from GPS';
			document.getElementById("send").style.color="#A6A6A6";
			break;
  		case accunum >= 20 :
		 	document.getElementById("message01").innerHTML = 'Confirmed approximative location';
		 	document.getElementById("message02").innerHTML = ' Please push the button of below "Send to 119"';
//		 	document.getElementById("aaa").innerHTML = '119�� �Ű��ϱ�';
			document.getElementById("send").style.color="#4C4C4C";
			break;
  		case accunum < 20 :
		 	document.getElementById("message01").innerHTML = 'Completed the confirmation of exact location';
		 	document.getElementById("message02").innerHTML = ' Please push the button of below "Send to 119"';
//		 	document.getElementById("aaa").innerHTML = '119�� �Ű��ϱ�';
//		 	document.getElementById("aaa").style.color="#33FF66";
			document.getElementById("send").style.color="black";
			break;
		}

		
		//�������ڵ����� �ּ�ã��----------------------------------------------
		geocoder.geocode({'latLng': mylatlan}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var vaddress = results[0].formatted_address;
				//vaddress = vaddress.replace('���ѹα�','');
				//vaddress = 'Address : '+vaddress.replace('�ѱ�','');
				document.getElementById('addr').innerHTML = vaddress;
    		}
  		});			
		// ȭ�鿡 ������ ǥ��	
        //document.getElementById('latitude').innerHTML = 'coordinate : Lat '+position.coords.latitude.toFixed(6);
		document.getElementById('latitude').innerHTML = position.coords.latitude.toFixed(6);
        //document.getElementById('longitude').innerHTML = 'Lon '+position.coords.longitude.toFixed(6);
		document.getElementById('longitude').innerHTML = position.coords.longitude.toFixed(6);
        //document.getElementById('altitude').innerHTML = 'Altitude : '+Number(position.coords.altitude).toFixed(0)+"m";
		document.getElementById('altitude').innerHTML = Number(position.coords.altitude).toFixed(0)+"m";
        //document.getElementById('accuracy').innerHTML = 'Tolerance: '+position.coords.accuracy.toFixed(0)+"m";	
		document.getElementById('accuracy').innerHTML = position.coords.accuracy.toFixed(0)+"m";			
    }		
	
 }  