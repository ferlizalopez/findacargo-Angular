var module = angular.module("app");
module.component("integrations", {
    templateUrl: "../components/integrations/integrations.component.html",
    controllerAs: "model",
    controller: ["$http", "$state", controller]
});

function controller($http, $state) {
    var self = this;
}
