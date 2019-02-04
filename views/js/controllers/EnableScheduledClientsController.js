angular.module('enablescheduledclients', [])
    .controller('enableScheduledClientsController', ['$scope', '$http', function ($scope, $http) {
        $scope.clientsLists = [];
        _.forEach(listData,function (client) {
            if(client.scheduledClient == '1') {
                client.scheduled  = true;
            } else {
                client.scheduled = false;
            }
            $scope.clientsLists.push(client);
        });

        //function to mark client as scheduled
        $scope.markClientScheduled = function (client, mark) {
            if (mark) {
                $http.post('/markClientScheduled/1/' + client._id, {})
                    .then(
                        function (response) {
                        },
                        function (response) {
                            console.log(response);
                        }
                    );
            } else {
                $http.post('/markClientScheduled/0/' + client._id, {})
                    .then(
                        function (response) {
                        },
                        function (response) {
                            console.log(response);
                        }
                    );
            }
        }
    }]);