angular.module('scheduledclients', ['angular.chosen'])
    .controller('scheduledClientsController', ['$window', '$scope', '$http', '$timeout', function ($window, $scope, $http, $timeout) {
        $scope.clientsLists = listData;
        $scope.allCarriers = carriersList;
        $scope.assignDiv = true;
        $scope.carrierDrivers = [];
        $scope.selectedClient = {};
        $scope.assignedDriversList = [];
        $scope.drivers = [];

        // function to remove a particular buyer
        $scope.removeClient = function (item) {
            var userId = item._id;
            bootbox.confirm("Are you Sure you want to delete!", function (confirmation) {
                if (confirmation) {
                    $http({
                        url: '/usersoftdelete',
                        method: "GET",
                        params: {userId: userId}
                    }).then(function (res) {
                            $window.location.reload(true);
                        },
                        function (err) {
                        });
                }
            });
        };

        // function to assign multiple carrier to a client
        $scope.assignCarrierToClient = function (client) {
            $scope.assignDiv = false;
            $scope.selectedClient = client;

            var carrierId = client && client.scheduledCarriers && client.scheduledCarriers[0] && client.scheduledCarriers[0].carrier;
            _.forEach($scope.allCarriers, function (item) {
                if (item._id == carrierId) {
                    //$scope.selectedCarrier = item;
                    $scope.getDriversForCarrier($scope.selectedCarrier);
                }
            });
            $scope.getExistingDriver(client);
        };

        //function to get all drivers for selected carriers.
        $scope.getDriversForCarrier = function (selectedCarrier) {
            $scope.carrierDrivers = [];
            $scope.drivers = [];
            $http({
                url: '/getDriverOfCarrier',
                method: "GET",
                params: {userId: selectedCarrier && selectedCarrier._id}
            }).then(function (res) {
                    $scope.carrierDrivers = res.data.data;
                    $timeout(function () {
                        $('#driver_list').val('').trigger('chosen:updated');
                    }, 100);
                },
                function (err) {
                });
        };

        //Final function to assign the drivers.
        $scope.assignToClient = function (drivers, selctedCarrier) {

            if (_.isEmpty(selctedCarrier)) {
                $window.alert("Please select a carrier")

            } else {
                var carriersList = [];
                //check if drivers selected
                if (drivers.length == 0) {
                    carriersList.push({
                        'carrier': selctedCarrier && selctedCarrier._id,
                        'driver': selctedCarrier && selctedCarrier._id
                    })
                } else {
                    drivers = [].concat(drivers);
                    for (var i = 0; i < drivers.length; i++) {
                        carriersList.push({'carrier': drivers[i].parent, 'driver': drivers[i]._id});
                    }
                }

                var client = $scope.selectedClient;
                $http.post('/assignCarrierToClient/' + client._id, {carriers: carriersList})
                    .then(
                        function (response) {
                            if (response.status == 200) {
                                $scope.selectedClient = response.data.data;
                                $scope.selectedCarrier = '';
                                $scope.drivers = '';
                                $scope.getExistingDriver($scope.selectedClient);
                            } else {
                                $window.alert('Error in updating the client.');
                            }
                        },
                        function (response) {
                            console.log(response);
                        }
                    );
            }
        };
        //Get list of existing drivers
        $scope.getExistingDriver = function (client) {
            var userIds = [];
            angular.forEach(client.scheduledCarriers, function (entry) {
                userIds.push(entry.driver);
            });
            $http({
                url: '/getAssignedDriever',
                method: "GET",
                params: {userIds: userIds}
            }).then(function (res) {
                    $scope.assignedDriversList = res.data.data;
                },
                function (err) {
                });
        };

        //Function to remove a driver form client.
        $scope.removeAssignedDriver = function (assignedDriver) {
            var client = $scope.selectedClient;
            var userId = assignedDriver._id;

            $http({
                url: '/removeDriverFromClient',
                method: "GET",
                params: {userId: userId, clientId: client._id}
            }).then(function (res) {
                    $scope.selectedClient = res.data.data;
                    $scope.getExistingDriver($scope.selectedClient);
                },
                function (err) {
                });
        };

        /*
         * navigate to show routes assignment page.
         */
        $scope.assignRoute = function (selectedClient) {
            localStorage.setItem('selectedClient', JSON.stringify(selectedClient));
            $window.location.href = "/assignroutes";
        };

        /*
         * navigate to upload scheduled routes.
         */
        $scope.uploadRoutes = function (selectedClient) {
            localStorage.setItem('selectedClient', JSON.stringify(selectedClient));
            $window.location.href = "/uploadRoutes";
        };

        /*
         * navigate to scheduled setting.
         */
        $scope.scheduledSetting = function (selectedClient) {
            localStorage.setItem('selectedClient', JSON.stringify(selectedClient));
            $window.location.href = "/scheduledSetting";
        }

        /*
         * Function to addZipCodes for Driver.
         */
        $scope.addZipCodes = function (driver, zipCodes) {
            if (zipCodes) {
                $http.post('/zipcodes/' + driver._id, {zipCodes: zipCodes})
                    .then(
                        function (response) {
                            if (response.status == 200) {

                            }
                        },
                        function (response) {
                            console.log(response);
                        }
                    );
            } else {
                $window.alert('Please enter the zipcodes.');
            }
        }

        $scope.edit = function (user) {
            user.edit = true;
        };

        $scope.editAction = function (user, type) {
            if (type) {
                user.edit = false;
                $http.put('user/' + user._id, {user: user}).then(function (res) {
                    console.log(res && res.data);
                }, function (err) {
                });
            }
            else {
                user.edit = false;
            }
        };

        $scope.viewClientsRoute = function (client) {
            localStorage.setItem('selectedClient', JSON.stringify(client));
            $window.location.href = "/adminroute?userId="+ client._id;
        };
    }]);