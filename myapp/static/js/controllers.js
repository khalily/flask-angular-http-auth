'use strict';


var myApp = angular.module('myApp');

myApp.controller('WelcomeCtrl', function($scope, $rootScope) {
    $scope.profile = {name: 'Stranger'};
    if ($rootScope.isLogin) {
        $scope.profile = $rootScope.profile;
    }
});

myApp.controller('LoginCtrl', function($scope, AuthService, $location, store, $rootScope) {
    if (AuthService.isAuthenticated) {
        $location.path('/');
    }

    $scope.hitMsg = '';

    function onLoginSuccess(token) {
        store.set('token', token);
        $scope.hitMsg = 'login success';
        $location.path('/');
    }

    function onLoginFailed() {
       $scope.hitMsg = 'username or password incorrect';
    }

    $scope.submit = function() {
        AuthService.signin({
            username: $scope.user.username,
            password: $scope.user.password
        }, onLoginSuccess, onLoginFailed)
    };

    $rootScope.$on('unauth_token', function () {
        store.remove('token');
        $location.path('/login');
        $scope.hitMsg = 'token expire, please login';
    });

    $rootScope.$on('unauth', function () {
        $location.path('/login');
        $scope.hitMsg = 'please login';
    });
});

myApp.controller('LogoutCtrl', function(AuthService, $location, store) {
    AuthService.signout();
    store.remove('token');
    $location.path('/');
});
