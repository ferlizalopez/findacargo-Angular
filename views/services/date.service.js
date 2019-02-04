(function() {
    angular
        .module('app')
        .service('dateService', dateService);

    function dateService($rootScope) {       
        // Returns ISO 8601 week number and year
        function getISOWeek(dt) {
            /*var jan1, week, date = new Date(date);
            date.setDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
            jan1 = new Date(date.getUTCFullYear(), 0, 1);
            week = Math.ceil((((date - jan1) / 86400000) + 1) / 7);
            return week;*/

            var tdt = new Date(dt.valueOf());
            var dayn = (dt.getDay() + 6) % 7;
            tdt.setDate(tdt.getDate() - dayn + 3);
            var firstThursday = tdt.valueOf();
            tdt.setMonth(0, 1);
            if (tdt.getDay() !== 4) 
            {
                tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
            }
            return 1 + Math.ceil((firstThursday - tdt) / 604800000);
        }
        return {
            getISOWeek : getISOWeek
        };
    }
})();