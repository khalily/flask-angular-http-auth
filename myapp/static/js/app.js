'use strict';


var myApp = angular.module('myApp', ['ngRoute', 'ngCookies', 'angular-storage']).config(function($routeProvider, $httpProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'static/partials/welcome.html',
        controller: 'WelcomeCtrl',
        loginRequired: false
    })
    .when('/login', {
        templateUrl: 'static/partials/login.html',
        controller: 'LoginCtrl',
        loginRequired: false
    })
    .when('/logout', {
        templateUrl: 'static/partials/welcome.html',
        controller: 'LogoutCtrl',
        loginRequired: true
    })
    .otherwise({
        rediretTo: '/'
    });

    $httpProvider.interceptors.push('tokenInvalidInterceptor');

}).run(function($location, $rootScope, store, AuthService) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        if (!$rootScope.isLogin && next.templateUrl) {
            var token = store.get('token');
            if (token) {
                AuthService.authenticate(token).then(function() {
                }, function() {
                    store.remove('token');
                    $location.path('/login');
                });
            } else if (next.loginRequired) {
                $location.path('/login');
            }
        }
    });

    $rootScope.auth = AuthService;

    $rootScope.$watch('auth.isAuthenticated', function(isAuthenticated) {
        console.log('auth');
        if (isAuthenticated) {
            $rootScope.isLogin = true;
            $rootScope.profile = $rootScope.auth.profile
        } else {
            $rootScope.isLogin = false;
        }
    });

    $rootScope.isActive = function (path) {
        if ($location.path().substr(0, path.length) == path) {
            if ($location.path() == '/' && path == '/')
                return true;
            else
                return path != '/';
        }
    }
});
