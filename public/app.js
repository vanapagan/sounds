var app = angular.module('app', ['ngMaterial']);

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
        fd.append('name', file);
        fd.append('sound', 'name' + '.wav');
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(function successCallback(response) {
            console.log('SUCCESS');
        }, function errorCallback(response) {
            console.log('ERROR');
        });
    }
}]);

app.controller('mainController', function ($scope, $http, fileUpload) {

    $scope.uploadFile = function () {
        var name = $scope.name;
        var file = $scope.myFile;
        console.log('file is ');
        console.dir(file);
        var uploadUrl = "/sounds";
        fileUpload.uploadFileToUrl(name, file, uploadUrl);
    };

    $scope.addFile = function () {
        uploadFile($scope.files,
            function (msg) // success
            {
                console.log('uploaded');
            },
            function (msg) // error
            {
                console.log('error');
            });
    }

    $scope.sounds = [];

    $http({
        method: 'GET',
        url: '/sounds'
    }).then(function successCallback(response) {
        $scope.sounds = response.data;
    }, function errorCallback(response) {
        console.log('error');
    });

    $scope.data = {
        selectedIndex: 0,
        secondLocked: true,
        secondLabel: "2",
        bottom: false
    };

    $scope.next = function () {
        $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2);
    };

    $scope.previous = function () {
        $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
    };

    $scope.addNewSound = function () {
        $http({
            method: 'POST',
            url: '/sounds',
            form: {
                name: $scope.name,
                file: $scope.file
            }
        }).then(function successCallback(response) {
            $scope.sounds = response.data;
        }, function errorCallback(response) {
            console.log(response);
            console.log('error');
        });
    };

});

