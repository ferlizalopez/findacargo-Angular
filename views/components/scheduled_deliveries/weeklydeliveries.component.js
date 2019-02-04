var module = angular.module("app");
module.component("weeklydeliveries", {
    templateUrl: "../components/scheduled_deliveries/weeklydeliveries.component.html",
    controllerAs: "model",
    controller: ["$http", "$state","spinnerService", "deliveryService", "dateService", controller]
});

function controller($http, $state, spinnerService, deliveryService, dateService) {
    this.spinnerChecker = spinnerService;
    this.currentDepartment = '';
    this.getDateRangeOfWeek = deliveryService.getDateRangeOfWeekForShorten;

    this.limitCount = 10;
    
    this.isOverLimit = false;
    this.showAll = false;

 
    
    this.getTodayWeekNumber = () => {
        let today = new Date();
        /*var onejan = new Date(today.getFullYear(),0,1);
        return Math.ceil((((today - onejan) / 86400000) + onejan.getDay()+1)/7);*/
        return dateService.getISOWeek(today);
    }

    this.weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.currentWeekNumber = this.getTodayWeekNumber();
    this.today  =  new Date();
    this.currentYear = this.today.getFullYear();
    this.currentDay = this.weekdays[this.today.getDay()].toLowerCase();

    this.getDeliveries = () => {
        if ($state.params.departmentname == 'undefined') {
            var apiCallUrl  = '/weekly_deliveries/delivery';
        } else {
            var apiCallUrl  = '/weekly_deliveries/delivery/' + encodeURI($state.params.departmentname);
        }
        spinnerService.show();
        $http.get(apiCallUrl)
            .then(res => {
                if (res.data.body) {
                    this.currentDepartment = $state.params.departmentname;
                    this.all_weekly_deliveries = deliveryService.prepareWeeklyList(res.data.body)    
                }
                if (this.all_weekly_deliveries&&this.all_weekly_deliveries.length>this.limitCount) {
                    this.weekly_deliveries = this.all_weekly_deliveries.slice(this.all_weekly_deliveries.length-this.limitCount, this.all_weekly_deliveries.length);
                    this.isOverLimit = true;
                }
                else {
                    this.weekly_deliveries = this.all_weekly_deliveries;
                }

                spinnerService.hide();
            })
    };

    this.toggleShowHide = () => {
        this.showAll = !this.showAll;
        if (this.showAll) {
            this.weekly_deliveries = this.all_weekly_deliveries;
        }
        else {
            this.weekly_deliveries = this.all_weekly_deliveries.slice(this.all_weekly_deliveries.length-this.limitCount, this.all_weekly_deliveries.length);            
        }
    }
    this.getDeliveries();


    this.isTodayCell = (year, weekNumber, weekDay) => {
        if (this.currentYear==year && this.currentWeekNumber==weekNumber && this.currentDay == weekDay) {
            return true;
        }
        else {
            return false;
        }
    }

    this.getDeliveryWindowTime = (start, end) => {
        if (start && end) {
            if (start.includes(".")) {
                var startSplitTime = start.split(".");
            }
            else if (start.includes(":")) {
                var startSplitTime = start.split(":");
            }
            if (end.includes(".")) {
                var endSplitTime = end.split(".");
            }
            else if (end.includes(":")) {
                var endSplitTime = end.split(":");
            }
            
            return startSplitTime[0] + ":" + startSplitTime[1] + '-' + endSplitTime[0] + ":" + endSplitTime[1];    
        }
    }

}