
var module = angular.module("app");
module.component("changepassword", {
    templateUrl: "../components/client_settings/changepassword.component.html",
    controllerAs: "model",
    controller: ["$http", "$state", "toastr", "$translate", controller]
});

function controller($http, $state, toastr, $translate) {

    
    this.$onInit = () => {
        
    };

}
