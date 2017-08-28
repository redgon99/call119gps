
var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {

        keepscreenon.enable();  //화면 켜기

        window.plugins.orientationLock.lock("portrait")  //화면화전 고정(landscape)

        //GPS 활성화
        cordova.plugins.locationAccuracy.canRequest(function(canRequest){
            if(canRequest){
                cordova.plugins.locationAccuracy.request(function (success){
                    //document.getElementById('message01').innerHTML = 'GPS수신중...'
                }, function (error){
                    alert('위치정보(GPS)가 켜져있어야 정확한 위치를 확인 할 수있습니다. 위치정보(GPS)를 켜주세요');
                    cordova.plugins.diagnostic.switchToLocationSettings();
                }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
            }
        });

        //Wifi 활성화
        cordova.plugins.diagnostic.isWifiEnabled(function(enabled){
            var str = enabled
            if(str == false){
                cordova.plugins.diagnostic.setWifiState(function(){
                    console.log("Wifi was enabled");
                }, function(error){
                    console.error("The following error occurred: "+error);
                },
                true);
            }
        }, function(error){
            console.error("The following error occurred: "+error);
        });

        watchPosition();
    },

};
app.initialize();

//-------------------------------위치정보-------------------------------------------
function watchPosition() {

    var options = {
        maximumAge: 3600000,
        timeout: 60000,
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