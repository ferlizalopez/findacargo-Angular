var module = angular.module("app");
module.component("accountStatement", {
    templateUrl: "../components/business_settings/accountStatement.component.html",
    controllerAs: "model",
    controller: ["$http", "$state", controller]
});

function controller($http, $state) {
    var self = this;

    this.payments = [];
    this.expenses = [];

    this.$onInit = () => {
        this.getPayments();
        this.getExpenses();
    }

    this.getPayments = () => {
        $http.get('/get_client_payments')
            .then(function (response) {
                self.payments = response.data.body;
                console.log(self.payments);
            });
    }

    this.getExpenses = () => {
        $http.get('/get_client_expenses')
            .then(function (response) {
                self.expenses = response.data.body;
                console.log(self.expenses);
            });
    }
}