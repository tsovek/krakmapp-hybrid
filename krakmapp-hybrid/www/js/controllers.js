angular.module('krakmApp.controllers', [])

.controller('AppCtrl', function ($scope, $state, loginService) {

    $scope.logout = function () {
        loginService.removeLoginData();
        $state.go('app.entrance');
    }
})

.controller('EntranceCtrl', function ($scope, $http, $window, loginService, objectsFactory) {

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.logged = loginService.getLoginData();
    });

    $scope.data = { hotelId: 0, key: "" };

    $scope.dataFromStorage = loginService.getLoginData();

    $scope.login = function (user) {
        $http({
            method: 'GET',
            url: 'http://192.168.0.12:5000/api/mobile/byHotelId',
            params: { hotelId: parseInt(user.hotelId, 10), key: user.key }
        }).then(function successCallback(response) {
            if (response.status === 200) {
                loginService.setLoginData(user);
                objectsFactory.setObjects(response.data);
                $scope.errorMsg = null;

                $window.location.reload(true);

            } else {
                $scope.errorMsg = "Something went wrong. Make sure of your data and try again.";
            }

        }, function errorCallback(response) {
            $scope.errorMsg = "Something went terribly wrong! Check your network connection.";
        });
    }
})

.controller('HotelCtrl', function ($scope, objectsFactory, mapFactory) {
    $scope.$on("$ionicView.enter", function (event, data) {
        $scope.onInit();
    });

    $scope.hotel = objectsFactory.getHotelInfo();

    $scope.onInit = function () {
        let mapOptions = mapFactory.getMapOptions();
        var map = new google.maps.Map(document.getElementById("map-hotel"), mapOptions);

        let pos = new google.maps.LatLng($scope.hotel.latitude, $scope.hotel.longitude)
        let marker = objectsFactory.getMarkerByType("Partners");
        marker.setPosition(pos);
        marker.setMap(map);

        map.setCenter(pos);
        map.setZoom(12);

        $scope.map = map;
    };
})

.controller('ClientCtrl', function ($scope, objectsFactory) {
    $scope.client = objectsFactory.getGuestInfo();
})

.controller('MainMapCtrl', function ($scope, mapFactory, objectsFactory, $cordovaGeolocation, $ionicPlatform) {

    $scope.$on("$ionicView.enter", function (event, data) {
        if (event.targetScope !== $scope)
            return;
        $scope.onInit();
    });

    $scope.markerModel = {
        markers: []
    };

    $scope.setLocation = function (lat, lng) {
        var pos = new google.maps.LatLng(lat, lng);

        if ($scope.markerModel.markers.length > 0) {
            for (let i in $scope.markerModel.markers) {
                let markerToRemove = $scope.markerModel.markers[i];
                markerToRemove.setMap(null);
            }
        }

        var marker = objectsFactory.getMarkerByType('You');
        marker.setPosition(pos);
        marker.setMap($scope.map);
        $scope.markerModel.markers.push(marker);

        $scope.map.setCenter(pos);
        $scope.map.setZoom(18);
    };

    $scope.getLocation = function () {
        $ionicPlatform.ready(function () {
            var posOptions = { timeout: 10000, enableHighAccuracy: false };
            $cordovaGeolocation.getCurrentPosition(posOptions).then(
              function (position) {
                  let lat = position.coords.latitude;
                  let long = position.coords.longitude;
                  $scope.setLocation(lat, long);

              }, function (err) {
                  console.log(err.message + " " + err.code);
              });
        });
    };

    $scope.onInit = function () {
        var mapOptions = mapFactory.getMapOptions();
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        var allObjects = objectsFactory.getAllObjects();
        var bounds = new google.maps.LatLngBounds();
        for (let i in allObjects.objects) {
            let objGroup = allObjects.objects[i];

            for (let j in objGroup.singleObjects) {
                let singleObject = objGroup.singleObjects[j];

                var pos = new google.maps.LatLng(singleObject.latitude, singleObject.longitude)
                var marker = objectsFactory.getMarkerByType(objGroup.type);
                marker.setPosition(pos);
                marker.setMap(map);

                attachWindow(marker, singleObject, objGroup.type);

                bounds.extend(pos);
            }
        }
        map.fitBounds(bounds);

        $scope.map = map;
    };

    attachWindow = function(marker, obj, type) {
        var infowindow = new google.maps.InfoWindow({
            content: this.getInfo(obj, type),
            maxWidth: 350
        });

        marker.addListener('click', function () {
            infowindow.open(marker.get('map'), marker);
        })
    };

    getInfo = function (object, type) {
        let content =
            '<div id="content">' +
                '<div id="siteNotice">' +
                // todo: image
                '</div>' +
                '<h4 class="firstHeading">' + object.name + '</h4>' +
                '<div id="bodyContent">' +
                    '<p>' + object.description + '</p>' +
                '</div>';
        if (type === "Partners") {
            content += '<br /><div><a class="btn btn-block btn-info">Get Discount!</a></div>';
        }
        content += '</div>';
        return content;
    };
})

.controller('RoutesCtrl', function ($scope, objectsFactory, $state) {
    $scope.routesModel = {
        allRoutes: objectsFactory.getRoutes()
    };

    $scope.onClick = function (route) {
        $state.go('app.singleRoute', { routeId: route.id});
    };
})

.controller('SingleRouteCtrl', function ($scope, $stateParams, routesFactory, objectsFactory, mapFactory, $cordovaGeolocation, $ionicPlatform) {

    $scope.$on("$ionicView.enter", function (event, data) {
        if (event.targetScope !== $scope)
            return;
        $scope.onInit();
    });

    $scope.setLocation = function (lat, lng) {
        for (let i in $scope.routeModel.locMarker) {
            $scope.routeModel.locMarker[i].setMap(null);
        }

        var pos = new google.maps.LatLng(lat, lng);
        var marker = objectsFactory.getMarkerByType("You");
        marker.setPosition(pos);
        marker.setMap($scope.map);

        $scope.routeModel.locMarker.push(marker);
        $scope.calculateAndDisplayRoute({ location: pos });
    };

    $scope.getLocation = function () {
        $ionicPlatform.ready(function () {
            var posOptions = { timeout: 10000, enableHighAccuracy: false };
            $cordovaGeolocation.getCurrentPosition(posOptions).then(
              function (position) {
                  let lat = position.coords.latitude;
                  let long = position.coords.longitude;
                  $scope.setLocation(lat, long);

              }, function (err) {
                  console.log(err.message + " " + err.code);
              });
        });
    };

    $scope.routeModel = {
        route: routesFactory.getById($stateParams.routeId),
        points: [],
        markers: [],
        locMarker: []
    };

    $scope.onInit = function () {
        $scope.directionsService = new google.maps.DirectionsService;
        $scope.directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
        $scope.map = new google.maps.Map(document.getElementById('map-singleRoute'),
            mapFactory.getMapOptions());

        $scope.directionsDisplay.setMap($scope.map);
        $scope.calculateAndDisplayRoute(null);
    };

    $scope.calculateAndDisplayRoute = function (origin) {
        var waypts = [];
        for (let i in $scope.routeModel.route.routeDetails) {
            var detail = $scope.routeModel.route.routeDetails[i];
            waypts.push({
                location: new google.maps.LatLng(detail.latitude, detail.longitude),
                stopover: true
            });
        }
        
        var first = origin
        if (origin === null) {
            first = waypts[0];
            waypts.splice(0, 1);
        }

        var last = waypts[waypts.length - 1];
        waypts.splice(waypts.length - 1, 1);

        $scope.directionsService.route({
            origin: first.location,
            destination: last.location,
            waypoints: waypts,
            optimizeWaypoints: false,
            travelMode: 'WALKING'
        }, function (response, status) {
            if (status === 'OK') {
                $scope.directionsDisplay.setDirections(response);
                var route = response.routes[0];
                $scope.routeModel.points.splice(0, $scope.routeModel.points.length);
                for (let i in route.legs) {
                    var leg = route.legs[i];
                    $scope.routeModel.points.push({
                        start_address: leg.start_address.substr(0, leg.start_address.indexOf(',')),
                        end_address: leg.end_address.substr(0, leg.end_address.indexOf(',')),
                        distance: leg.distance,
                        steps: leg.steps
                    });
                }
                $scope.$apply();

                for (let i in $scope.routeModel.markers) {
                    $scope.routeModel.markers[i].setMap(null);
                }

                $scope.routeModel.markers.splice(0, $scope.routeModel.markers.length);
                for (let i in $scope.routeModel.route.routeDetails) {
                    var detail = $scope.routeModel.route.routeDetails[i];

                    var marker = objectsFactory.getMarkerByType(detail.type);
                    marker.setPosition(new google.maps.LatLng(detail.latitude, detail.longitude));
                    marker.setMap($scope.map);

                    attachWindow(marker, detail, detail.type);

                    $scope.routeModel.markers.push(marker);
                }

            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    attachWindow = function (marker, obj, type) {
        var infowindow = new google.maps.InfoWindow({
            content: this.getInfo(obj, type),
            maxWidth: 350
        });

        marker.addListener('click', function () {
            infowindow.open(marker.get('map'), marker);
        })
    };

    getInfo = function (object, type) {
        let content =
            '<div id="content">' +
                '<div id="siteNotice">' +
                // todo: image
                '</div>' +
                '<h4 class="firstHeading">' + object.name + '</h4>' +
                '<div id="bodyContent">' +
                    '<p>' + object.description + '</p>' +
                '</div>';
        if (type === "Partners") {
            content += '<br /><div><a class="btn btn-block btn-info">Get Discount!</a></div>';
        }
        content += '</div>';
        return content;
    };
});
