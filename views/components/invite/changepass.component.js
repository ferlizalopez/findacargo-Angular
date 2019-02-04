/**
 * Created by SK on 10/23/2017.
 */
var module = angular.module("app");
module.component("changePass", {
    templateUrl: "../components/invite/changepass.component.html",
    controllerAs: "model",
    controller: ["$http", "$stateParams", controller]
});

function controller($http, $stateParams){
    this.password = '';
    this.confirmPassword = '';
    this.showSuccess = false;
    this.message = '';


    this.changePass = () => {
        var token = $stateParams.token;
        $http.put(`${API_URL}/invite/changepass`, {token: token, password: this.confirmPassword})
            .then(response=>{
                if(response.data.success){
                    this.showSuccess = true;
                    this.message = response.data.msg;
                    this.password = '';
                    this.confirmPassword = '';
                }
            })
    }
}