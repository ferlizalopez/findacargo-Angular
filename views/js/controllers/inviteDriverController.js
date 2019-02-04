angular.module('inviteDriver', ['customModule'])
    .controller('inviteDriverController', function ($scope, $http, alert, $timeout) {
        $scope.members = [{type: 'driver'}, {type: 'driver'}, {type: 'driver'}];
        $scope.lng = i18n.detectLanguage();
        $scope.addMember = function () {
            $http.post('/users', {user: $scope.members}).then(function (res) {
                if (res.data[0].error) {
                    $scope.members[0].error = res.data[0];
                }
                else if (res.data[0] == 200) {
                    $scope.members[0].success = true;
                    $timeout(function () {
                        $scope.members[0] = {active: false, type: 'driver'};
                    }, 5000);
                }
                if (res.data[1].error) {
                    $scope.members[1].error = res.data[1];
                }
                else if (res.data[1] == 200) {
                    $scope.members[1].success = true;
                    $timeout(function () {
                        $scope.members[1] = {active: false, type: 'driver'};
                    }, 5000);
                }
                if (res.data[2].error) {
                    $scope.members[2].error = res.data[2];
                }
                else if (res.data[2] == 200) {
                    $scope.members[2].success = true;
                    $timeout(function () {
                        $scope.members[2] = {active: false, type: 'driver'};
                    }, 5000);
                }
            }, function (err) {
                window.alert("Error occurred: " + err.data.error);
            });
        }
    });