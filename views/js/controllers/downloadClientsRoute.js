angular.module('downloadRoutess', [])
    .controller('downloadRoutesController', function ($timeout, $window, $scope, $http) {
        $scope.allClients = clients;
        $scope.message = '';
        //function to call on form submit
        $scope.submit = function (isValid) {
            if (isValid) {

                $scope.checkRoutesAvailability();
            }
        };

        $scope.checkRoutesAvailability = function () {
            var date = new Date($scope.date);
            $http({
                url: '/checkroutesavailability/' + date,
                method: "GET",
                params: {userId: $scope.selectedClient._id}
            }).then(function (res) {
                    var result = res.data.data;
                    if (result) {
                        $window.location.href = '/downloadroutes?date=' + date + '&userId=' + $scope.selectedClient._id;
                    } else {
                        $scope.message = "No Route available for selected client and date."
                        $timeout(function () {
                            $scope.message = '';
                            $scope.selectedClient = '';
                            $scope.date = '';
                        }, 5000);
                    }
                },
                function (err) {
                });
        };
    });