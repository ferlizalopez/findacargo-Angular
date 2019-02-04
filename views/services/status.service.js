(function() {
    angular
        .module('app')
        .factory('statusService', ["$translate", statusService]);

    function statusService($translate) {
        var fac = {
            getStatus : getStatus,
            getReturnStatus:getReturnStatus
        };

        return fac;

        function getStatus(id) {
            var statuscodes = [
                $translate.instant('common.created'), 
                $translate.instant('common.in_progress'), 
                $translate.instant('common.finished'), 
                $translate.instant('common.notreceived'), 
                $translate.instant('common.redelivery'),
                $translate.instant('common.returned')
            ];
            return statuscodes[id-1];
        }
        function getReturnStatus(id) {
            var statuscodes = [
                $translate.instant('common.created'), 
                $translate.instant('common.in_progress'), 
                $translate.instant('common.returned'), 
                $translate.instant('common.notreceived'), 
                $translate.instant('common.redelivery')];
            return statuscodes[id-1];
        }
    }
})();