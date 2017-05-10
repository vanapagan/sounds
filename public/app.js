var app = angular.module('app', ['ngMaterial']);

app.controller('mainController', function ($scope, $http) {

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