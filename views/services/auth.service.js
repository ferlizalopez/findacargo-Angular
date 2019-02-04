/**
 * Created by jeton on 6/28/2017.
 */
(function() {
    angular
        .module('app')
        .service('authService', authService);

    function authService($rootScope) {
        function isAuthenticated() {
            var parseCookies = function(request) {
                var list = {},
                    rc = request;

                rc && rc.split(';').forEach(function(cookie) {
                    var parts = cookie.split('=');
                    list[parts.shift().trim()] = decodeURI(parts.join('='));
                });

                return list;
            }

            $rootScope.userDetails = parseCookies(document.cookie);

            if ($rootScope.userDetails.token === undefined || $rootScope.userDetails.token === '') {
                window.location.replace('/login');
                return false;
            }

            localStorage.setItem('userEmail', JSON.stringify($rootScope.userDetails.email));
            localStorage.setItem('userId', JSON.stringify($rootScope.userDetails.userId));
            localStorage.setItem('apikey', JSON.stringify($rootScope.userDetails.apikey));
            localStorage.setItem('approved', JSON.stringify($rootScope.userDetails.approved));
            return true;
        }
        return {
            isAuthenticated: isAuthenticated
        }
    }
})();