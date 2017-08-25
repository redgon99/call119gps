<!DOCTYPE html>
<html lang="en">
<head>
<script>
var userAgent = navigator.userAgent.toLowerCase(); // 접속 핸드폰 정보 
// 모바일 홈페이지 바로가기 링크 생성 
if(userAgent.match('iphone')) { 
    document.write('<link rel="apple-touch-icon" href="/icon/ios_wclip.png" />') 
} else if(userAgent.match('ipad')) { 
    document.write('<link rel="apple-touch-icon" sizes="72*72" href="/icon/ios_wclip.png" />') 
} else if(userAgent.match('ipod')) { 
    document.write('<link rel="apple-touch-icon" href="/icon/ios_wclip.png" />') 
} else if(userAgent.match('android')) { 
    document.write('<link rel="shortcut icon" href="/icon/and_wclip.png" />') 
} 
</script>

<meta name="viewport" charset="en-us" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<title>GangWon Call119 WebApp</title>
<link rel="apple-touch-icon" href="/icon/ios_wclip.png">
<link rel="shorcut icon" href="/icon/and_wclip.png">
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB_jXQ_1DZ1EHwam8xBI95g8Qq1hcOQNbI" async defer></script>
<script src="js/geo_app_en.js"></script>
<script> //----구글 어날리틱스 코드
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  ga('create', 'UA-52972406-1', 'auto');
  ga('send', 'pageview');
</script>

<script type="text/javascript">
	function sendata() {
		var tel_number = localStorage.getItem("tel_number"); //webstorage를 이용한 전화번호 캐시읽기
		//alert("ws is"+tel_number);
		if (tel_number == null) {  // 캐시된 전화번호가 없으면 입력창 실행
			var s_tel = prompt("Please input your mobile phone number");	
			localStorage.setItem("tel_number", s_tel);
			//alert(s_tel);				
		}
		else {
			s_tel=tel_number;		
		}
		//localStorage.setItem("tel_number", "01050944525");
		//alert(s_tel);
		//localStorage.removeItem("tel_number");
		
		//var s_addr = document.getElementById('addr').innerHTML.substring(5,50);	
		//var s_lat = document.getElementById('latitude').innerHTML.substring(7,20);
		//var s_lon = document.getElementById('longitude').innerHTML.substring(3,20);
		//var s_accu = document.getElementById('accuracy').innerHTML.substring(7,10);
		
		var s_addr = document.getElementById('addr').innerHTML;	
		var s_lat = document.getElementById('latitude').innerHTML;
		var s_lon = document.getElementById('longitude').innerHTML;
		var s_accu = document.getElementById('accuracy').innerHTML;
		//var get = new HttpGet("wlocDB.asp?tel="+s_tel+"&addr="+s_addr+"&lon="+s_lon+"&lat="+s_lat+"&accu="+s_accu+"");
		//var exchange = httpClient.get("http://www.example.com" );
		var coordi = s_lat * s_lon;
		var s_sender = "w"

		if(coordi==0) {
			alert("Coordinates information is missing. Please try again later");
			return;
		}
		
		accu = s_accu.replace("m","");
		//alert(accu);
		
		if(accu > 100) {
			if(confirm("The position error is too large. Are you sure you want to transfer yet? When the transfer will be deemed to agree to provide personal information.")){
				window.open('wlocDB.asp?tel='+s_tel+'&addr='+s_addr+'&lon='+s_lon+'&lat='+s_lat+'&accu='+s_accu+'&s_sender='+s_sender,'window');
				return;
			}
			else{
				return;
			}
			
		}
		
		if(confirm("When the transfer will be deemed to agree to provide personal information.")){	
			window.open('wlocDB.asp?tel='+s_tel+'&addr='+s_addr+'&lon='+s_lon+'&lat='+s_lat+'&accu='+s_accu+'&s_sender='+s_sender,'window');
		    //window.open('locDB.asp','_blank');
		}
		else{
			return;
		}
	}
</script>

<style type="text/css">
* {
	margin: 0px;
	padding: 0px;
}
html, body { 
height: 100%;
color:#666666;
}
p {
	display:table-cell;
	vertical-align:middle;
}
.float_style {
    float: left;
}
#title {
	text-align:center;
	font-size:larger;
	color:#00FFFF;
	background-color:
	display:inline-table;
	vertical-align:middle;	
	height:6%;
	width:100%;
	border:3px;
    background: -webkit-linear-gradient(#852126, #F00); /* For Safari 5.1 to 6.0 */
    background: -o-linear-gradient(#852126, #F00); /* For Opera 11.1 to 12.0 */
    background: -moz-linear-gradient(#852126, #F00); /* For Firefox 3.6 to 15 */
    background: linear-gradient(#852126, #F00); /* Standard syntax (must be last) */	
}

#addr, #altitude {
	background-color:#E5E5E5;
}
#accuracy, #titleaccuracy { 
	background-color:#E5E5E5;
	color:black;
}

#latitude, #longitude, #space  {
}

#message01, #message02 {
	height:4%;
	color:#FF0;
	background-color:#000;
	font-size:14;	
	vertical-align:middle;	
}
#map_canvas {
	width:100%;
	height:62%;
}

#send {
	color:#C6C6C6;
	background-color:#33FF66;
	font-size:larger;
	width:100%;
	display:inline-table;
	vertical-align:middle;
	text-align:center;
	height:7%;
	background: -webkit-linear-gradient(#33FF66, #3C6); /* For Safari 5.1 to 6.0 */
    background: -o-linear-gradient(#33FF66, #3C6); /* For Opera 11.1 to 12.0 */
    background: -moz-linear-gradient(#33FF66, #3C6); /* For Firefox 3.6 to 15 */
    background: linear-gradient(#33FF66, #3C6); /* Standard syntax (must be last) */
}
#bottom {
	text-align:center;
	font-size:medium;
	color:#00FFFF;
	display:table;
	height:4%;
	width:100%;
	border:3px;
    background: -webkit-linear-gradient(#852126, #F00); /* For Safari 5.1 to 6.0 */
    background: -o-linear-gradient(#852126, #F00); /* For Opera 11.1 to 12.0 */
    background: -moz-linear-gradient(#852126, #F00); /* For Firefox 3.6 to 15 */
    background: linear-gradient(#852126, #F00); /* Standard syntax (must be last) */	
}

</style>

</head>

<body>
<div id="title" align="center"><h2>Gangwon Contact 119</h2></div>
<div id="titleaddr" class="float_style">Adddress :&nbsp;</div>
<div id="addr" ></div>

<div id="titlelatitude" class="float_style">Coordinates :&nbsp; Lat &nbsp;</div>
<div id="latitude" class="float_style">Latitude</div>
<div id="space" class="float_style">&nbsp;/&nbsp;</div>
<div id="titlelongitude" class="float_style">Lon &nbsp;</div>
<div id="longitude">Longitude</div>

<div id="titlealtitude" class="float_style">Altitude :&nbsp;</div>
<div id="altitude" class="float_style"></div>
<div id="space" class="float_style">&nbsp;/&nbsp;</div>
<div id="titleaccuracy" class="float_style">Tolerance :&nbsp;</div>
<strong><mark><div id="accuracy"></div></mark></strong>

<div id="message01">Message1</div>
<div id="message02">Message2</div>
<div id="send" onClick="sendata();"><h1>Send to 119</h1></div>
<div id="map_canvas"></div>
<div id="bottom"><p>Gangwon Province Fire Headquarter</p></div>
</body>
</html>
