(function() {
    angular
        .module('app')
        .factory('storageService', storageService);

    function storageService() {
        return {
            getApproved : getApproved,
        };

        function getApproved() {
            return (JSON.parse(localStorage.getItem('approved')) == 'true');
        }
    }
})();