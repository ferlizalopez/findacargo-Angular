angular.module('adminAssignCarrierDelivery', [])
    .controller('adminAssignDelivery', function ($scope, $http, $timeout) {

        $scope.selectedDelivery = JSON.parse(localStorage.getItem('adminDelivery'));
        $scope.allCarriers = [];

        $scope.getAllCarriers = function () {
            $http({
                url: '/getAllCarriers',
                method: "GET"
            }).then(function (res) {
                    $scope.allCarriers = res.data && res.data.data;
                },
                function (err) {
                });
        }
        $scope.getAllCarriers();


        //function to assign a carrier to delivery
        $scope.assignCarrier = function (selectedCarrier) {
            console.log(selectedCarrier);
        }

        $scope.resetForm = function () {
        };

        //Invite controller code
        $scope.members = [{type: 'admin'}, {type: 'admin'}, {type: 'admin'}];
        $scope.addMember = function () {
            $http.post('/users', {user: $scope.members}).then(function (res) {
                if (res.data[0].error) {
                    $scope.members[0].error = res.data[0];
                }
                else if (res.data[0] == 200) {
                    $scope.members[0].success = true;
                    $timeout(function () {
                        $scope.members[0] = {active: false, type: 'admin'};
                    }, 5000);
                }
                if (res.data[1].error) {
                    $scope.members[1].error = res.data[1];
                }
                else if (res.data[1] == 200) {
                    $scope.members[1].success = true;
                    $timeout(function () {
                        $scope.members[1] = {active: false, type: 'admin'};
                    }, 5000);
                }
                if (res.data[2].error) {
                    $scope.members[2].error = res.data[2];
                }
                else if (res.data[2] == 200) {
                    $scope.members[2].success = true;
                    $timeout(function () {
                        $scope.members[2] = {active: false, type: 'admin'};
                    }, 5000);
                }
                $scope.getAllCarriers();
            }, function (err) {
                window.alert("Error occurred: " + err.data.error);
            });
        }
    });
