angular.module('assignRoute', [])
    .controller('assignRouteController', ['$window', '$scope', '$http', '$timeout', function ($window, $scope, $http, $timeout) {

        $scope.selectedClient = JSON.parse(localStorage.getItem('selectedClient'));
        $scope.clientsRoute = [];
        $scope.assignedDriversList = [];
        $scope.allCarriers = [];

        //Function to get all the drivers
        $scope.getAllCarriers = function () {
            $http({
                url: '/getAllCarriers',
                method: "GET"
            }).then(function (res) {

                    $scope.allCarriers = res.data.data;
                },
                function (err) {
                });
        };
        $scope.getAllCarriers();


        //Function to get the client's routes
        $scope.getClientsRoute = function (userId) {
            $http({
                url: '/getClientsRoute',
                method: "GET",
                params: {
                    userId: userId
                }
            }).then(function (res) {
                    console.log(res.data.routes);
                    $scope.clientsRoute = res.data.routes;
                },
                function (err) {
                });
        };
        $scope.getClientsRoute($scope.selectedClient._id);

        $scope.edit = function (edit) {
            edit.edit = true;
        };

        //Get the carries of selected client
        $scope.getCarriersOfClient = function () {
            var client = $scope.selectedClient;
            var userIds = [];
            angular.forEach(client.scheduledCarriers, function (entry) {
                userIds.push(entry.driver);
            });
            $http({
                url: '/getAssignedDriever',
                method: "GET",
                params: {
                    userIds: userIds
                }
            }).then(function (res) {
                    $scope.assignedDriversList = res.data.data;
                },
                function (err) {
                });
        };
        $scope.getCarriersOfClient();

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
                        console.log(response);
                        if(response && response.data && response.data .response == "vehicle_not_found") {
                            $window.alert("Selected driver has no vehicle.");
                        }
                        $scope.getClientsRoute($scope.selectedClient._id);
                    },
                    function (error) {
                        console.log(error);
                    }
                );
        };
        $scope.getName = function (id) {
            var name;
            for (var i = 0; i < $scope.allCarriers.length; i++) {
                if ($scope.allCarriers[i]._id == id) {
                    name = $scope.allCarriers[i].name;
                    break;
                }
            }
            return name;
        };

    }]);