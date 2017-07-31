<!DOCTYPE html>
<head>
<script> // 접속핸드폰 언어에 따른 해당 언어페이지 호출
var lang = navigator.language;
lang = lang.substr(0,2);
//alert(lang);

if(lang == 'en') {
//	alert('english phone');	
	window.location.replace('wg_en.asp');
}
else if(lang == 'ja'){
	window.location.replace('wg_ja.asp');
}
else if(lang == 'zh'){
	window.location.replace('wg_cn.asp');
}
</script>

<meta name="viewport" charset="euc-kr" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<title>강원119신고앱</title>
<link rel="stylesheet" href="https://www.w3schools.com/lib/w3.css">
<link rel="apple-touch-icon" href="/icon/ios_wclip.png">
<link rel="shorcut icon" href="/icon/and_wclip.png">
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB_jXQ_1DZ1EHwam8xBI95g8Qq1hcOQNbI" async defer></script>
<script src="js/geo_app.js" charset='euc-kr'></script>
<script> //----구글 어날리틱스 코드
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  ga('create', 'UA-52972406-1', 'auto');
  ga('send', 'pageview');
</script>

<script type="text/javascript">
var userAgent = navigator.userAgent.toLowerCase(); // 접속 핸드폰 정보
var phonemodel; 

// 모바일 홈페이지 바로가기 링크 생성 
if(userAgent.match('iphone')) { 
    document.write('<link rel="apple-touch-icon" href="/icon/ios_wclip.png" />')
	phonemodel = 'iphone';
} else if(userAgent.match('ipad')) { 
    document.write('<link rel="apple-touch-icon" sizes="72*72" href="/icon/ios_wclip.png" />') 
} else if(userAgent.match('ipod')) { 
    document.write('<link rel="apple-touch-icon" href="/icon/ios_wclip.png" />') 
} else if(userAgent.match('android')) { 
    document.write('<link rel="shortcut icon" href="/icon/and_wclip.png" />') 
	phonemodel = 'android';
} 
function reloadpage(){
	document.location.reload();
}
function sendata() {
	var tel_number = localStorage.getItem("tel_number"); //webstorage를 이용한 전화번호 캐시읽기
	//alert("ws is"+tel_number);
	if (tel_number == null) {  // 캐시된 전화번호가 없으면 입력창 실행
		var s_tel = prompt("귀하의 휴대전화번호를 입력해주세요 119상황실에서 연락드립니다.");	
		localStorage.setItem("tel_number", s_tel);
		//alert(s_tel);
	}
	else {
		s_tel=tel_number;		
	}
	//localStorage.setItem("tel_number", "01050944525");
	//alert(s_tel);
	//localStorage.removeItem("tel_number");
	
	//var s_tel = '010-0000-0000';
	var s_addr = document.getElementById('addr').innerHTML.substring(5,50);	
	var s_lat = document.getElementById('latitude').innerHTML.substring(7,20);
	var s_lon = document.getElementById('longitude').innerHTML.substring(3,20);
	var s_accu = document.getElementById('accuracy').innerHTML.substring(7,10);
	//var get = new HttpGet("wlocDB.asp?tel="+s_tel+"&addr="+s_addr+"&lon="+s_lon+"&lat="+s_lat+"&accu="+s_accu+"");
	//var exchange = httpClient.get("http://www.example.com" );
	var coordi = s_lat * s_lon;
	var s_sender = "A"

	if(coordi==0) {
		alert("좌표정보가 없습니다. 잠시후 다시 시도해 주세요");
		return;
	}
	
	accu = s_accu.replace("m","");
	//alert(accu);
	
	var url1 = 'https://119survey.org/119app/w/wlocDBB.asp?tel='+s_tel+'&addr='+s_addr+'&lon='+s_lon+'&lat='+s_lat+'&accu='+s_accu+'&s_sender='+s_sender;
	var url2 = 'https://119survey.org/119app/w/reskey.asp';
	if(accu > 200) {
		if(confirm("위치오차가 너무 큽니다. 그래도 전송하시겠습니까? 전송하게 되면 개인정보제공에 동의하는 것으로 간주합니다.")){
			//window.open(url1+s_tel+'&addr='+s_addr+'&lon='+s_lon+'&lat='+s_lat+'&accu='+s_accu+'&s_sender='+s_sender,'window');
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange=function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				alert('전송이 완료되었습니다.')
				//alert(xmlhttp.responseText);
				localStorage.setItem("mykey", xmlhttp.responseText);
				}
			}
			xmlhttp.open("GET", url1, true)
			xmlhttp.send();
			return;
		}
		else{
			return;
		}
	}
	
	if(confirm("전송하게 되면 개인정보제공에 동의하는 것으로 간주합니다. 전송하시겠습니까?")){	
		//window.open(url1+s_tel+'&addr='+s_addr+'&lon='+s_lon+'&lat='+s_lat+'&accu='+s_accu+'&s_sender='+s_sender,'window');

		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			alert('전송이 완료되었습니다.')
			//alert(xmlhttp.responseText);
			localStorage.setItem("mykey", xmlhttp.responseText);
			}
		}
		xmlhttp.open("GET", url1, true)
		xmlhttp.send();	
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
.float_style {
    float: left;
}
#title {
	text-align:center;
	font-size:large;
	color:#00FFFF;
	display:table;	
	height:6%;
	width:100%;
	border:3px;
    background: -webkit-linear-gradient(#852126, #F00); /* For Safari 5.1 to 6.0 */
    background: -o-linear-gradient(#852126, #F00); /* For Opera 11.1 to 12.0 */
    background: -moz-linear-gradient(#852126, #F00); /* For Firefox 3.6 to 15 */
    background: linear-gradient(#852126, #F00); /* Standard syntax (must be last) */
}
#intitle, #inbottom, #inreloadpage, #insend{
	display:table-cell;
	vertical-align:middle;
}
#addr, #altitude {
	background-color:#E5E5E5;
}
#accuracy { 
	background-color:#E5E5E5;
	color:black;
}

#message01 {
	color:#FF0;
	background-color:#000;
	font-size:x-large;	
	vertical-align:middle;	
}
#message02 {  
	height:5%;
	color:#FF0;
	background-color:#000;
	font-size:20px;
}

#map_canvas {
	width:100%;
	height:55%;
}

#send {
	color:#C6C6C6;
	font-size:larger;
	width:100%;
	display:table;
	text-align:center;
	height:7%;
	background: -webkit-linear-gradient(#33FF66, #3C6); /* For Safari 5.1 to 6.0 */
    background: -o-linear-gradient(#33FF66, #3C6); /* For Opera 11.1 to 12.0 */
    background: -moz-linear-gradient(#33FF66, #3C6); /* For Firefox 3.6 to 15 */
    background: linear-gradient(#33FF66, #3C6); /* Standard syntax (must be last) */
}

#bottom {
	text-align:center;
	font-size:14px;
	color:#00FFFF;
	background-color:
	vertical-align:middle;
	display:table;
	height:5%;
	width:100%;
	border:3px;
    background: -webkit-linear-gradient(#852126, #F00); /* For Safari 5.1 to 6.0 */
    background: -o-linear-gradient(#852126, #F00); /* For Opera 11.1 to 12.0 */
    background: -moz-linear-gradient(#852126, #F00); /* For Firefox 3.6 to 15 */
    background: linear-gradient(#852126, #F00); /* Standard syntax (must be last) */	
}
#reloadpage {
	font-size:larger;
	width:100%;
	text-align:center;
	height:7%;
	background: -webkit-linear-gradient(#33FF66, #3C6); /* For Safari 5.1 to 6.0 */
    background: -o-linear-gradient(#33FF66, #3C6); /* For Opera 11.1 to 12.0 */
    background: -moz-linear-gradient(#33FF66, #3C6); /* For Firefox 3.6 to 15 */
    background: linear-gradient(#33FF66, #3C6); /* Standard syntax (must be last) */
}

#float_camera {
	display:scroll;
	position:fixed;
	top:10px;
	right:10px;
}


</style>

</head>

<body>
<div id="title" align="center"><h2 id="intitle"><b>강원119신고</b></h2></div>
<div id="addr">주소</div>
<div id="latitude" class="float_style">위도</div>
<div id="space" class="float_style">&nbsp;/&nbsp;</div>
<div id="longitude">경도</div>
<div id="altitude" class="float_style">고도</div>
<div id="space" class="float_style">&nbsp;/&nbsp;</div>
<strong><mark><div id="accuracy">위치오차</div></mark></strong>
<div id="message01">알림메시지</div>
<div id="message02">알림메시지</div>
<div id="send" onClick="sendata();"><h1 id="insend" class="w3-text-bold"><b>119에 신고하기</b></h1></div>
<div id="map_canvas"></div>
<img id="gpsonImage" height="auto" width="100%" style="align-content:center" hidden="">
<div id="reloadpage" onClick="reloadpage();" hidden=""><p id="inreloadpage">GPS를 켰으면 여기를 터치하여 다시 열기</p></div>
<div id="bottom"><h3 id="inbottom">강 원 도 소 방 본 부</h3></div>
</body>
</html>
