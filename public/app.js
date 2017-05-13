var app = angular.module('app', ['ngMaterial', 'angularMoment']);

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function (name, file, uploadUrl) {
        var fd = new FormData();
        fd.append('name', name);
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(function successCallback(response) {
            return response;
        }, function errorCallback(response) {
            return response;
        });
    }
}]);

app.service('deleteService', ['$http', function ($http) {
    this.deleteSound = function (name, uploadUrl) {
        var fd = new FormData();
        $http.delete(uploadUrl + "/" + name, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(function successCallback(response) {
            return response;
        }, function errorCallback(response) {
            return response;
        });
    }
}]);

app.controller('mainController', function ($scope, $http, fileUpload, deleteService, moment) {

    var allSounds = function () {
        return $http({
            method: 'GET',
            url: '/sounds'
        });
    };

    function updateSoundList() {
        allSounds().then(function successCallback(response) {
            $scope.sounds = response.data;
        }, function errorCallback(response) {
        });
    }

    var uploadSound = function (fd) {
        console.log(fd);
        return $http.post("/sounds", fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        });
    }

    updateSoundList();

    $scope.filter = "";
    $scope.msg = "";

    $scope.data = {
        selectedIndex: 0
    };

    $scope.next = function () {
        $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2);
    };

    $scope.previous = function () {
        $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
    };

    $scope.playSound = function (name) {
        playSound(new Audio('http://localhost:3000/sounds/' + name));
    };

    var setFields = function (name, file) {
        var fd = new FormData();
        fd.append('name', name);
        fd.append('file', file);
        return fd;
    };

    $scope.uploadFile = function () {
        if ($scope.name != null && $scope.myFile != null && $scope.name != "") {
            uploadSound(setFields($scope.name, $scope.myFile)).then(function successCallback(response) {
                updateSoundList();
                $scope.name = '';
                $scope.myFile = null;
                $scope.msg = response.data.msg;
            }, function errorCallback(response) {
                return response;
            });
        } else {
            $scope.msg = 'Both name and file are required!'
        }
    };

    $scope.deleteSound = function (name) {
        var uploadUrl = "/sounds";
        deleteService.deleteSound(name, uploadUrl);
        updateSoundList();
    };

    $scope.formatDate = function (date) {
        return moment().hour(8).minute(0).second(0).toDate();
    };

});

function playSound(sound) {
    sound.play();
};