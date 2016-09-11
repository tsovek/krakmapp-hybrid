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
});