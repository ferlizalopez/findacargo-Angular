var module = angular.module("app");
module.component("plannedpickups", {
    templateUrl: "../components/pickups/planned_pickups.component.html",
    controllerAs: "model",
    controller: ["$http", "$state", "urlService", "spinnerService", "$translate", controller]
});

function controller($http, $state, urlService, spinnerService, $translate) {
    this.plannedpickups = [];

    this.spinnerChecker = spinnerService;
    this.showNewPickups = false;

    this.getDate = function () {
        return moment((new Date()).toDateString()).format('MM-DD-YYYY');
    };

    this.toggleNewPickups = () => {
        this.showNewPickups = !this.showNewPickups;
        this.getPickups();
    }

    this.getPickups = () => {
        spinnerService.show();
        var creator = getCookie('userId');

        var url = this.showNewPickups == false ?
            `${urlService.getApiUrl()}/v1/zone-delivery/pickups/${creator}` :
            `${urlService.getApiUrl()}/v1/zone-delivery/pickups/${creator}/${this.getDate()}`;

        $http.get(url)
            .then((deliveries) => {
                console.log(deliveries.data);
                if (deliveries.data && deliveries.data.length > 0) {
                    this.plannedpickups = deliveries.data.map(item => {
                        item.deliverydate = moment(item.date, moment.ISO_8601).format("L");
                        item.deliverydayofweek = $translate.instant(`common.${item.deliverydayofweek.toLowerCase()}`)
                        return item;
                    });
                } else {
                    this.plannedpickups = [];
                }
                spinnerService.hide();
        })
    }

    this.$onInit = () => {
       this.getPickups();
    };

}