/**
 * Created by ttnd on 16/9/16.
 */
(function (window, angular) {

    //Variables
    var hostname = window.location.hostname;
    var apiUrl = 'https://api.nemlevering.dk/v1';
    if (hostname.match(/localhost/) || hostname.match(/dev/)) {
        apiUrl = 'https://dev.api.nemlevering.dk/v1';
    }
    angular.module('viewrequests')
        .constant('HOST', {
            URL: apiUrl
        });
    console.log('api url', apiUrl);
})(window, angular);