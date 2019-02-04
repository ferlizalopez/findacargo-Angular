angular.module('routeAssign', [])
    .controller('routeAssignController', function ($window,$scope, $http) {
        $scope.allCarriers = carriers;
        $scope.allClients = clients;
        $scope.clientsRoute = [];
        $scope.carrierVehicles = [];


        //Function to get the client's routes
        $scope.getClientsRoute = function (userId) {
            $http({
                url: '/getClientsRoute',
                method: "GET",
                params: {
                    userId: userId
                }
            }).then(function (res) {
                    var routesArr = res.data && res.data.routes;

                    _.forEach(routesArr, function (route) {
                        _.forEach(route.data, function (data) {
                            var tempArr = [];
                            var routeId = data && data.routeId;
                            _.forEach(data.routes, function (entry) {
                                entry.routeId = routeId;
                                tempArr.push(entry);
                                $scope.clientsRoute = tempArr;
                            });
                        });
                    });
                },
                function (err) {
                });
        };

        $scope.getSelectedCarrierVehicles = function (selectedCarrier) {
            $http({
                url: '/vehicles/' + selectedCarrier._id,
                method: "GET"
            }).then(function (res) {
                    $scope.carrierVehicles = res && res.data && res.data.data;
                },
                function (err) {
                });
        };

        //function to call on form submit
        $scope.submit = function (isValid) {
            if (isValid) {

                var dataObj = {
                    driverId: $scope.selectedCarrier && $scope.selectedCarrier._id,
                    routeName: $scope.selectedRoute && $scope.selectedRoute.vehicle_id,
                    routeId: $scope.selectedRoute && $scope.selectedRoute.routeId,
                    clientId: $scope.selectedClient && $scope.selectedClient._id,
                    vehicleId: $scope.selectedVehicle && $scope.selectedVehicle._id,
                    identifier: $scope.selectedVehicle && $scope.selectedVehicle.identifier,
                    type: $scope.selectedVehicle && $scope.selectedVehicle.type
                };

                $http.post('/assignRouteToCarrierManully', {
                        data: dataObj
                    })
                    .then(
                        function (response) {
                            $window.alert('Route assigned successfully');
                            $scope.resetForm();
                        },
                        function (err) {
                            console.log(err);
                        }
                    );
            }
        };
        // function to reset the form.
        $scope.resetForm = function () {
            document.getElementById('route_assign_form').reset();
        }
    });