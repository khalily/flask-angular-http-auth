'use strict';

var myApp = angular.module('myApp');

myApp.service('AuthService', function($q, $http){
    var self = this;
    self.profile = null;
    self.isAuthenticated = false;

    function request(url, username_or_token, password) {
        return {
            method: 'GET',
            url: url,
            headers: {
                Accept: 'application/json',
                Authorization: 'Basic ' + btoa(username_or_token + ':' + password)
            }
        };
    }

    self.signin = function (options, successCallback, errorCallback) {
        var req = request('/auth/login', options.username, options.password);
        $http(req).
        then(function(response) {
                var token = response.data.token;
                if (token) {
                    self.isAuthenticated = true;
                    self.profile = response.data.profile;
                    successCallback(token);
                }

            }, function(error) {
                console.log(error.message);
                errorCallback();
            }
        );

    };

    self.signout = function () {
        self.isAuthenticated = false;
        self.profile = null;
    };

    self.authenticate = function (token) {
        var req = request('/auth/login_with_token', token, '');
        var deferred = $q.defer();
        $http(req)
            .then(function (response) {
                self.profile = response.data.profile;
                self.isAuthenticated = true;
                deferred.resolve();
            }, function () {
                self.isAuthenticated = false;
                deferred.reject();
            });
        return deferred.promise;
    }
});

myApp.factory('tokenInvalidInterceptor', ['$q', '$location', '$rootScope', 'store',
    function ($q, $location, $rootScope, store) {
    return {
        'response': function (response) {
            if (response.status == 401) {
                if (store.get('token'))
                    $rootScope.$broadcast('unauth_token');
                else
                    $rootScope.$broadcast('unauth');
                return $q.reject();
            }
            return $q.resolve(response);
        },

        'responseError': function (rejection) {
            if (rejection.status == 401) {
                if (store.get('token'))
                    $rootScope.$broadcast('unauth_token');
                else
                    $rootScope.$broadcast('unauth');
            }
            return $q.reject(rejection);
        }
    }
}]);
