<!DOCTYPE html>
<head>
<script> // 접속핸드폰 언어에 따른 해당 언어페이지 호출
var firstCnt = 0;
var lang = navigator.language;
var cbx;
var infoOk, pnumOk, pdataOk, accuOk;
var s_addr;
var s_lat;
var s_lon;
var s_accu;
var coordi;
var s_sender = "A";
var s_tel

lang = lang.substr(0,2);

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
<link rel="stylesheet" href="https://www.w3schools.com/lib/w3-theme-blue-grey.css">
<link rel="apple-touch-icon" href="/icon/ios_wclip.png">
<link rel="shorcut icon" href="/icon/and_wclip.png">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">

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

function reloadpage(){
	document.location.reload();
}

function telCheck(){ //전화번호 체크
	var tel_number = localStorage.getItem("tel_number"); //webstorage를 이용한 전화번호 캐시읽기
	if (tel_number == null || tel_number == "") {  // 캐시된 전화번호가 없으면 입력창 실행
		document.getElementById('msg02').innerHTML = '<i class="fa fa-warning"></i>' + ' 전화번호를 입력해주세요';
		document.getElementById('inputPnum').style.display = 'block';
		document.getElementById('confirmOk').onclick = '';
		pnumOk = 0;
	}
	else {
		s_tel = tel_number;
		pnumOk = 1
	}

	if(firstCnt > 0){
		//alert('second check tel')
		lastCheck();
	}
}

function infoChecked(){ //정보제공 체크
    cbx = document.getElementById('infoCheck').checked;
    localStorage.setItem("infoCheck",cbx);
    if(cbx == true){
    	document.getElementById('msg01').style.display = 'none';
    	infoOk = 1
    }
    if(cbx == false){
    	document.getElementById('msg01').style.display = 'block';
    	document.getElementById('msg01').innerHTML = '<i class="fa fa-warning"></i>' + ' 정보제공에 동의해 주세요';
		infoOk = 0
    }

	if(firstCnt > 0){
		lastCheck();
	}
}

function dataCheck(){ //좌표유무 체크
	s_lat = document.getElementById('latitude').innerHTML.substring(7,20);
	s_lon = document.getElementById('longitude').innerHTML.substring(3,20);
	//s_lat = 0

	coordi = s_lat * s_lon; //좌표정보가 없으면

	if(coordi == 0) { //좌표정보가 없으면 안내메시지 표출
		document.getElementById('msg03').style.display = 'block';
		document.getElementById('confirmOk').onclick = '';
		pdataOk = 0
	}
	else{
		document.getElementById('msg03').style.display = 'none';
		pdataOk = 1
	}
	if(firstCnt > 0){ // 마지막 조건 체크
		lastCheck();
	}
}

function accuCheck(){ // 
	s_accu = document.getElementById('accuracy').innerHTML.substring(7,10);

	if(s_accu > 200){ //오차반경이 200미터 이상이면 표출
		document.getElementById('msg04').style.display = 'block';
		accuOk = 0
	}
	else{
		document.getElementById('msg04').style.display = 'none';
		accuOk = 1
	}

	if(firstCnt > 0){
		//alert('second check pdata')
		lastCheck();
	}
}

function call119(){
	document.getElementById('id01').style.display = "block";
	infoChecked(); // 
	telCheck();
	dataCheck();
	lastCheck();

	firstCnt  =  ++firstCnt
}

function lastCheck(){ // 전송조건 마지막 체크
	var checkSum = infoOk + pnumOk + pdataOk + accuOk;
	if(checkSum == 4) {
    	document.getElementById('confirmOk').classList.remove('w3-grey');
    	document.getElementById('confirmOk').classList.add('w3-green');
    	document.getElementById('confirmOk').onclick = sendata;
	}
	else{
    	document.getElementById('confirmOk').classList.remove('w3-green');
    	document.getElementById('confirmOk').classList.add('w3-grey');
    	document.getElementById('confirmOk').onclick = '';
	}
}

function sendata() { //데이터 전송
	s_addr = document.getElementById('addr').innerHTML.substring(5,50);
	s_lat = document.getElementById('latitude').innerHTML.substring(7,20);
	s_lon = document.getElementById('longitude').innerHTML.substring(3,20);
	s_accu = document.getElementById('accuracy').innerHTML.substring(7,10);

	//alert('sendata')
	var url1 = 'https://119survey.org/119app/w/wlocDBB.asp?tel='+s_tel+'&addr='+s_addr+'&lon='+s_lon+'&lat='+s_lat+'&accu='+s_accu+'&s_sender='+s_sender;
	var url2 = 'https://119survey.org/119app/w/reskey.asp';
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			alert('신고가 완료되었습니다.')
			//alert(xmlhttp.responseText);
			localStorage.setItem("mykey", xmlhttp.responseText);
			document.getElementById('id01').style.display = 'none';
			}
		}
		xmlhttp.open("GET", url1, true)
		xmlhttp.send();
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

#inreloadpage, #insend{
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
	background-color:#424242;
	font-size:x-large;	
	padding-left: 5px 
}
#message02 {  
	height:5%;
	color:#FF0;
	background-color:#000;
	background-color:#424242;
	font-size:20px;
	padding-left: 5px 
}

#map_canvas {
	width:100%;
	height:65%;
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

</style>
</head>

<body>

<div id="addr">주소</div>
<div id="latitude" class="float_style">위도</div>
<div id="space" class="float_style">&nbsp;/&nbsp;</div>
<div id="longitude">경도</div>
<div id="altitude" class="float_style">고도</div>
<div id="space" class="float_style">&nbsp;/&nbsp;</div>
<strong><mark><div id="accuracy">위치오차</div></mark></strong>
<div id="message01">알림메시지1</div>
<div id="message02">알림메시지2</div>
<div id="send" onClick="call119();"><h1 id="insend" class="w3-text-bold"><b>119에 신고하기</b></h1></div>
<div id="map_canvas"></div>
<img id="gpsonImage" height="auto" width="100%" style="align-content:center" hidden="">
<div id="reloadpage" onClick="reloadpage();" hidden=""><p id="inreloadpage">GPS를 켰으면 여기를 터치하여 다시 열기</p></div>

<!-- 전화번호 수정  모달 -->
<div id="id01" class="w3-modal">
    <div class="w3-modal-content w3-card-4">
        <header class="w3-display-container w3-theme-d1 w3-center">
            <i class="material-icons w3-xxlarge w3-display-right w3-padding-small" style="font-size:36px" onclick = "document.getElementById('id01').style.display='none'" >close</i>
            <h3>신고하기</h3>
        </header>

        <div class="w3-container">
        	<div id="msg01" style="display: none"><i class="fa fa-warning"></i></div>
            <div class="w3-bar w3-border">
                <p class="w3-bar-item">개인정보 및 위치정보 제공에 동의</p>
                <input id="infoCheck" onclick="infoChecked()" class="w3-bar-item w3-check w3-green" type="checkbox">
            </div>

            <div id="msg02"></div>
            <div id="inputPnum" class="w3-text-blue" style="display: none">
                <input class="w3-input  w3-border w3-bar-item" id="myphoneNumber" onchange="savePnum()" type="text" style="font-size: 20px" placeholder="전화번호 입력">
            </div>

            <div id="msg03" class="w3-red" style="display: none; padding: 3px"><p><i class="fa fa-warning"></i> 좌표정보가 없습니다. 잠시후 다시 시도해주세요</p>
            </div>
            <div id="msg04" class="w3-red" style="display: none; padding: 3px"><p><i class="fa fa-warning"></i>위치오차가 큽니다. (현재오차 반경: <span id="aaccu"></span>)
            	<br>정확한 위치가 아닐수 있으니 정확한 위치정보를 수신할 때까지 기다려 주세요 <br>GPS가 꺼져있다면 켜주시고 하늘이 보이는 곳으로 이동해주세요</p>
            </div>
            <div id="confirm" class="w3-cell-row" style="padding: 10px">
            	<div id="confirmOk" class="w3-container w3-cell w3-green w3-xlarge w3-round w3-center"><p>확 인</p></div>
            	<div>&nbsp;&nbsp;</div>
            	<div class="w3-container w3-cell w3-red w3-xlarge w3-round w3-center" onclick="document.getElementById('id01').style.display = 'none'"><p>취 소</p></div>
            </div>
        </div>

        <footer class="w3-container w3-theme-d1">
            <div id="link" class="w3-panel w3-medium" style="padding-left: 0px">
            </div>
        </footer>
    </div>
</div><!--모달 종료-->

<script>
function savePnum(){
	localStorage.setItem('tel_number',document.getElementById('myphoneNumber').value);
	document.getElementById('msg02').style.display = 'none';
	document.getElementById('inputPnum').style.display = 'none';
	s_tel = document.getElementById('myphoneNumber').value;
	pnumOk = 1

	if(firstCnt > 0){
		//alert('second check')
		lastCheck();
	}
}

//정보제공 동의 값을 읽어서 체크컨트롤에 적용
cbx = localStorage.getItem("infoCheck")
if(cbx == 'true'){
    //alert("true")
    document.getElementById('infoCheck').checked = true;
}
else{
    document.getElementById('infoCheck').checked = false;   
}

</script>

</body>
</html>
