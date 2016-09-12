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
        },

        getAllObjects: function () {
            let allObjects = localStorageService.get('objectsData');
            if (allObjects === null) {
                return {
                    objects: []
                }
            }
            return allObjects.objects;
        },
        
        getMarkerByType: function (type) {
            var iconDefault = {
                size: new google.maps.Size(88, 126),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(44, 63)
            };
            var marker = {};

            switch (type) {
                case "Monuments":
                    iconDefault.url = 'http://localhost:8100/img/marker-red.png';
                    return new google.maps.Marker({
                        icon: iconDefault
                    });
                case "Entertainments":
                    iconDefault.url = 'http://localhost:8100/img/marker-green.png';
                    return new google.maps.Marker({
                        icon: iconDefault
                    });
                case "Partners":
                    iconDefault.url = 'http://localhost:8100/img/marker-blue.png';
                    return new google.maps.Marker({
                        icon: iconDefault
                    });
                default:
                    iconDefault.url = 'http://localhost:8100/img/marker-pink.png';
                    return new google.maps.Marker({
                        icon: iconDefault
                    });
            }
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
                scaleControl: true
            };
        }
    }
});