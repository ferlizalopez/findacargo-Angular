/**
 * Created by jeton on 6/28/2017.
 */
var module = angular.module("app");
module.component("buyerNav", {
    templateUrl: "../components/navbars/buyer-nav.component.html",
    controllerAs: "model",
    controller: ["$http", "$state", "$scope", controller]
});

function controller($http, $state, $scope){
    $scope.departments = [];
    console.log($state.params.departmentname);
    this.$onInit = () => {        
        $http.get('/delivery_settings/')
            .then(response => {
                var departmentData = getCookie('departmentData');
                var departments = JSON.parse(departmentData);
                var setting = {}
                if (response.data.body) {
                    var setting = response.data.body
                    $scope.showReturn = setting.allow_return
                    console.log('$scope.showReturn', $scope.showReturn)
                }

                var depts = departments.departments||[]
                if (typeof departments.departments != 'undefined' && departments.departments.length > 0) {
                    if (!setting.allow_express) {
                        depts = depts.filter(o=>{
                            return o.typeOfDelivery != 'Express / On-demand'
                        })
                    }
                }
                $scope.departments = depts;

                if(!$scope.departments || $scope.departments.length == 0) {
                    $scope.departments.push({
                        name:"Default"
                    })
                }
            });
    };
}
