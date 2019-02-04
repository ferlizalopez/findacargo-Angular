angular.module('buyerAssignCarrier', ['customModule'])
    .controller('buyerAssignController', function ($scope, $http,$window) {
        $scope.clientsRoute = [];
        $scope.assignedDriversList = [];
        //Function to get the client's routes
        $scope.getClientsRoute = function () {
            $http({
                url: '/getClientsRoute',
                method: "GET",
            }).then(function (res) {
                    $scope.clientsRoute = res.data.routes;
                },
                function (err) {
                });
        };
        $scope.getClientsRoute();

        $scope.edit = function (edit) {
            edit.edit = true;
        };

        //Get the carries of selected client
        $scope.getAllDriversOfClient = function () {
            $http({
                url: '/clientsdrivers',
                method: "GET"
            }).then(function (res) {
                    $scope.assignedDriversList = res.data.data;
                },
                function (err) {
                });
        };
        $scope.getAllDriversOfClient();

        i18n.detectLanguage() === 'da' ? $scope.assigncarrier = 'TIldel til..' : $scope.assigncarrier = 'Assign To...';

        // Function to assign driver to one route.
        $scope.assginDriverToRoute = function (driver, route,data) {

            var queryObj = {
                driverId: driver._id,
                routeName: route && route.vehicle_id,
                routeId:data.routeId
            };

            $http.post('/assignCarrierToRoute', {
                    data: queryObj
                })
                .then(
                    function (response) {
                        if(response && response.data && response.data .response == "vehicle_not_found") {
                            $window.alert("Selected driver has no vehicle.");
                        }
                        $scope.getClientsRoute();
                    },
                    function (error) {
                    }
                );
        };

        $scope.getName = function (id) {
            var name;
            for (var i = 0; i < $scope.assignedDriversList.length; i++) {
                if ($scope.assignedDriversList[i]._id == id) {
                    name = $scope.assignedDriversList[i].name;
                    break;
                }
            }
            return name;
        };

    });