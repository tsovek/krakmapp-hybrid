angular.module('krakmApp.factories', [])

.factory('loginService', function (localStorageService) {
    return {
        hasLoginData: function () {
            return localStorageService.get('loginData') !== null;
        },

        getLoginData: function () {
            return localStorageService.get('loginData');
        },

        setLoginData: function (data) {
            localStorageService.set('loginData', data);
        },

        removeLoginData: function () {
            localStorageService.remove('loginData');
        }
    }
})
.factory('objectsFactory', function (localStorageService) {
    return {
        setObjects: function (objects) {
            localStorageService.set('objectsData', objects);
        }
    }
})
.factory('mapFactory', function() {
    return {
        getCenter: function() {
            return new google.maps.LatLng(50.0666501, 19.9449799);
        },

        getMapOptions: function () {
            var myLatlng = this.getCenter();

            var styleArray = [
              {
                  featureType: "all",
                  stylers: [
                    { saturation: -80 }
                  ]
              }, {
                  featureType: "road.arterial",
                  elementType: "geometry",
                  stylers: [
                    { hue: "#00ffee" },
                    { saturation: 50 }
                  ]
              }, {
                  featureType: "poi.business",
                  elementType: "labels",
                  stylers: [
                    { visibility: "off" }
                  ]
              }
            ];
            return {
                center: myLatlng,
                zoom: 17,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: styleArray,
                disableDefaultUI: true,
                scaleControl: true
            };
        }
    }
});