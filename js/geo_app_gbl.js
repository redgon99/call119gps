window.onload = init;

function init() 
{
	var map; 
    var marker;
		
   if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showLocation, errorCallback);
   } else {
        document.getElementById('message01').innerHTML='���� �������� Geolocation�� �������� �ʽ��ϴ�.';
   }
   
   function errorCallback(error) {
        var errorMessage;
		switch(error.code)
		{
		   case error.PERMISSION_DENIED:
		       errorMessage = "GPS(��ġ����)�� Ȱ��ȭ ���ּ���";
			   break;
		   case error.POSITION_UNAVAILABLE:
		       errorMessage = "GPS(��ġ����)�� Ȱ��ȭ ���ּ���";
			   break;
		   case error.TIMEOUT:
		       errorMessage = "GPS(��ġ����)�� Ȱ��ȭ ���ּ���";
			   break;
	       default:
		       errorMessage = "�� �� ���� ������ �߻��Ͽ����ϴ�.";
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
        document.getElementById('message01').innerHTML = '���� �������� Geolocation�� �������� �ʽ��ϴ�.';
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
		 	document.getElementById("message01").innerHTML = ' ��ġ ã�� �غ���...';
		 	document.getElementById("message02").innerHTML = ' GPS�� ���������� ���ּ���!';
			document.getElementById("send").style.color="#D5D5D5";
			break;
  		case accunum >= 100 :
		 	document.getElementById("message01").innerHTML = ' ��Ȯ�� ��ġ�� ã����...';
		 	document.getElementById("message02").innerHTML = ' GPS�κ��� ��Ȯ�� ��ġ�� �޴����Դϴ�.!';
			document.getElementById("send").style.color="#A6A6A6";
			break;
  		case accunum >= 20 :
		 	document.getElementById("message01").innerHTML = ' �밭�� ��ġ�� Ȯ�εǾ����ϴ�.';
		 	document.getElementById("message02").innerHTML = ' �Ʒ� 119�� �Ű��ϱ� ��ư�� �����ּ���';
//		 	document.getElementById("aaa").innerHTML = '119�� �Ű��ϱ�';
			document.getElementById("send").style.color="#4C4C4C";
			break;
  		case accunum < 20 :
		 	document.getElementById("message01").innerHTML = ' ��Ȯ�� ��ġȮ�� �Ϸ�!';
		 	document.getElementById("message02").innerHTML = ' �Ʒ� 119�� �Ű��ϱ� ��ư�� �����ּ���';
//		 	document.getElementById("aaa").innerHTML = '119�� �Ű��ϱ�';
//		 	document.getElementById("aaa").style.color="#33FF66";
			document.getElementById("send").style.color="black";
			break;
		}

		
		//�������ڵ����� �ּ�ã��----------------------------------------------
		geocoder.geocode({'latLng': mylatlan}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var vaddress = results[0].formatted_address;
				vaddress = vaddress.replace('���ѹα�','');
				vaddress = '�ּ� : '+vaddress.replace('�ѱ�','');
				document.getElementById('addr').innerHTML = vaddress;
    		}
  		});			
		// ȭ�鿡 ������ ǥ��	
        document.getElementById('latitude').innerHTML = '��ǥ : ���� '+position.coords.latitude.toFixed(6);
        document.getElementById('longitude').innerHTML = '�浵 '+position.coords.longitude.toFixed(6);
        document.getElementById('altitude').innerHTML = '�� : '+Number(position.coords.altitude).toFixed(0)+"m";
        document.getElementById('accuracy').innerHTML = '��ġ���� : '+position.coords.accuracy.toFixed(0)+"m";	
    }		
	
 }  