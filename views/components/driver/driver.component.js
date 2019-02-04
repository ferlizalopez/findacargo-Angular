/**
 * Created by jeton on 6/28/2017.
 */
var module = angular.module("app");
module.component("driver", {
    templateUrl: "../components/driver/driver.component.html",
    controllerAs: "model",
    controller: ["$http", "$state", controller]
});

function controller($http, $state){

}
