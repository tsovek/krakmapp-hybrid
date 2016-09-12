angular.module('krakmApp.controllers', [])

.controller('AppCtrl', function ($scope, $state, loginService) {
    $scope.logout = function () {
        loginService.removeLoginData();
        $state.go('app.entrance');
    }
})

.controller('EntranceCtrl', function ($scope, $http, $state, loginService, objectsFactory) {
    $scope.data = { hotelId: 0, key: "" };

    $scope.enterTheMatrix = function () {
        if (loginService.hasLoginData()) {
            $state.go('app.mainMap');
        }
    }
    $scope.dataFromStorage = loginService.getLoginData();

    $scope.login = function (user) {
        $http({
            method: 'GET',
            url: 'api/mobile/byHotelId',
            params: { hotelId: parseInt(user.hotelId, 10), key: user.key }
        }).then(function successCallback(response) {
            loginService.setLoginData(user);
            objectsFactory.setObjects(response.data);

            $state.go('app.mainMap');

        }, function errorCallback(response) {
            
        });
    }
})

.controller('MainMapCtrl', function ($scope, $compile, mapFactory, objectsFactory) {
    $scope.onInit = function () {
        let mapOptions = mapFactory.getMapOptions();
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        var allObjects = objectsFactory.getAllObjects();
        var bounds = new google.maps.LatLngBounds();
        for (let i in allObjects.objects) {
            let objGroup = allObjects.objects[i];

            for (let j in objGroup.singleObjects) {
                let singleObject = objGroup.singleObjects[j];

                let pos = new google.maps.LatLng(singleObject.latitude, singleObject.longitude)
                let marker = objectsFactory.getMarkerByType(objGroup.type);
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

    getInfo = function(object, type) {
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
    }
});
