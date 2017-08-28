window.onload = init;

function init() 
{
	var map; 
    var marker;
    var addArr = new Array();

	var lat = localStorage.getItem("lat");
	var lon = localStorage.getItem("lon");
	//alert(lat)

	if(lat != null ){
		lat = 37.885;
		lon = 127.729
	}
		
	var mylatlan = new google.maps.LatLng(lat,lon);
	var geocoder = new google.maps.Geocoder();
	var mapProp = {
		zoom: 15,
		center: mylatlan,
		scaleControl: true,
		streetViewControl: false,
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.LARGE,
			position: google.maps.ControlPosition.LEFT_CENTER
		},			
		gestureHandling: 'greedy',
		mapTypeId: google.maps.MapTypeId.ROADMAP
		}
	map = new google.maps.Map(document.getElementById("map_canvas"),mapProp);

	function errorCallback(error) {
	    var errorMessage;
		switch(error.code)
		{
			case error.PERMISSION_DENIED:
				errorMessage = "�Ʒ� �׸��� �����ؼ� GPS(��ġ����)�� ���ּ���";
				window.open('https://119survey.org/w/wgpss.asp','_blank');
				//noposdata();
				break;
			case error.POSITION_UNAVAILABLE:
				errorMessage = "�Ʒ� �׸��� �����ؼ� GPS(��ġ����)�� ���ּ���";
				noposdata();
				break;
			case error.TIMEOUT:
				errorMessage = "�Ʒ� �׸��� �����ؼ� GPS(��ġ����)�� ���ּ���";
				noposdata();
				break;
			default:
				errorMessage = "�Ʒ� �׸��� �����ؼ� GPS(��ġ����)�� ���ּ���";
				noposdata();
				break;		   	   
		}
		document.getElementById('message01').innerHTML=errorMessage;
	}

	function noposdata() {
		document.getElementById('send').style.display = 'none';
		document.getElementById('send').hidden = 1;
		document.getElementById('insend').hidden = 1;
		document.getElementById('addr').hidden = 1;
		document.getElementById('latitude').hidden = 1;
		document.getElementById('longitude').hidden = 1;
		document.getElementById('altitude').hidden = 1;
		document.getElementById('accuracy').hidden = 1;
		document.getElementById('space').hidden = 1;
		document.getElementById('message02').hidden = 1;
		document.getElementById('map_canvas').hidden = 1;
		document.getElementById('reloadpage').style.display = 'table';
		document.getElementById('reloadpage').hidden = 0;
		document.getElementById('gpsonImage').hidden = 0;
		if(phonemodel == 'android') {
			document.getElementById('gpsonImage').src = "images/gpsonA.jpg";
		}
		if(phonemodel == 'iphone') {
			document.getElementById('gpsonImage').src = "images/gpsonI.jpg";
		}
	}
   
   if(navigator.geolocation) {
        var watchId = navigator.geolocation.watchPosition(successCallback, errorCallback,
            {enableHighAccuracy: true,
				timeout: 60000, 
			 	maximumage: 10000});
        setTimeout(function() {
			navigator.geolocation.clearWatch(whatchId);
        }, 600000);
   } else {
		document.getElementById('message01').innerHTML = '���� �������� Geolocation�� �������� �ʽ��ϴ�.';
   }
   
	function successCallback(position) { //�ι�° ��ǥ����, ��Ȯ�� ������ ����
		//��ġ���� ����
		localStorage.setItem("lat" , position.coords.latitude);
		localStorage.setItem("lon" , position.coords.longitude);

		mylatlan = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);		
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
			gestureHandling: 'greedy',
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
				//console.log(results)
				var vaddress = results[0].formatted_address;
				addArr = vaddress.split(' ');
				localStorage.setItem("staddr1" , addArr[1]);
				localStorage.setItem("staddr2" , addArr[2]);
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
        document.getElementById('aaccu').innerHTML = position.coords.accuracy.toFixed(0)+"m";

        dataCheck();
        accuCheck();    
    }		
}  