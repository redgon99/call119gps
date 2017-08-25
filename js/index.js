
var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        //this.receivedEvent('deviceready');
        //alert('index.js')
        keepscreenon.enable();  //화면 켜기
        window.plugins.orientationLock.lock("portrait")  //화면화전 고정(landscape)
        cordova.plugins.diagnostic.isGpsLocationEnabled(function(enabled){
            var str = enabled;
            //alert(str)
            if(str == false){
                alert("GPS가 꺼져있습니다. GPS(위치정보)를 켜주세요");
                cordova.plugins.diagnostic.switchToLocationSettings();
            }
            console.log("GPS location is " + (enabled ? "enabled" : "disabled"));
        }, function(error){
            alert("위치정보를 사용할 수 없습니다.");
        });
        //백그라운드 모드 활성화
        //cordova.plugins.backgroundMode.enable();
        watchPosition();
    },

};
app.initialize();

//-------------------------------위치정보-------------------------------------------
function watchPosition() {

    var options = {
        maximumAge: 3600000,
        timeout: 3000,
        enableHighAccuracy: true,
    }

    var watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);

    function onSuccess(position) {

        localStorage.setItem("lat" , position.coords.latitude); // 위도
        localStorage.setItem("lon" , position.coords.longitude); // 경도
        localStorage.setItem("alt" , position.coords.altitude);  // 고도
        localStorage.setItem("accu" , position.coords.accuracy); // 위치정확도
/*
        alert('Latitude: '          + position.coords.latitude          + '\n' +
         'Longitude: '         + position.coords.longitude         + '\n' +
         'Altitude: '          + position.coords.altitude          + '\n' +
         'Accuracy: '          + position.coords.accuracy          + '\n' +
         'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
         'Heading: '           + position.coords.heading           + '\n' +
         'Speed: '             + position.coords.speed             + '\n' +
         'Timestamp: '         + position.timestamp                + '\n');
*/

    };

    function onError(error) {
        //alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
    }
}