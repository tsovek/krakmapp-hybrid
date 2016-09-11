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

.controller('MainMapCtrl', function ($scope, $compile, mapFactory) {
    $scope.onInit = function () {
        var mapOptions = mapFactory.getMapOptions();
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        $scope.map = map;


    };
});
