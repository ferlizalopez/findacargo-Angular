(function () {
    angular
        .module('app')
        .service('urlService', urlService);

    function urlService() {
        function getApiUrl() {
            var hostname = window.location.hostname;
            var apiurl = '';

            if (hostname === 'dev.my.nemlevering.dk') {
                apiurl = 'https://dev.api.nemlevering.dk';
            } else if (hostname === 'my.nemlevering.dk') {
                apiurl = 'https://api.nemlevering.dk';
            } else if (hostname === 'localhost') {
                apiurl = 'http://localhost:3333';
            } else {
                apiurl = 'http://10.0.53.90:8000';
            }

            return apiurl;
        }

        function getTrackingUrl() {
            var hostname = window.location.hostname;
            var apiurl = '';

            if (hostname === 'dev.my.nemlevering.dk') {
                apiurl = 'https://dev.tracking.nemlevering.dk';
            } else if (hostname === 'my.nemlevering.dk') {
                apiurl = 'https://track.goidag.com';
            } else if (hostname === 'localhost') {
                apiurl = 'http://localhost:4200';
            } else {
                apiurl = 'https://track.goidag.com';
            }

            return apiurl;
        }

        return {
            getApiUrl: getApiUrl,
            getTrackingUrl: getTrackingUrl,
        };
    }
})();


