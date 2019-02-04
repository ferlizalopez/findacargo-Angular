angular.module('accountHistory', [])
    .controller('accountHistoryController', function ($scope, $http) {

        //Variables
        var hostname = window.location.hostname;
        var apiUrl = 'https://api.nemlevering.dk/v1';
        if (hostname.match(/localhost/) || hostname.match(/dev/)) {
            apiUrl = 'https://dev.api.nemlevering.dk/v1';
        }

        $scope.deliveries = [];
        $scope.getDeliveries = function () {
            var xhr = new XMLHttpRequest();
            var token_auth = '';
            var url = apiUrl + "/auth/login";
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var json = JSON.parse(xhr.responseText);

                    token_auth = json.token;

                    var getV = new XMLHttpRequest();
                    getV.open("GET", apiUrl + "/deliveries", true);
                    getV.setRequestHeader("Content-type", "application/json");
                    getV.setRequestHeader("Authorization", "JWT " + token_auth);
                    getV.onreadystatechange = function () {
                        if (getV.readyState == 4 && getV.status == 200) {
                            var json = JSON.parse(getV.responseText);
                            var finishedDelivery = [];
                            angular.forEach(json, function (delivery) {
                                if (isNaN(delivery.price)) {
                                    delivery.total = undefined;
                                } else {
                                    delivery.total = delivery.price - (delivery.price * discount / 100);
                                }

                                if (delivery.status && delivery.status.id && delivery.status.id == '7') {
                                    finishedDelivery.push(delivery);
                                }
                                //console.log(delivery);
                            });

                            $scope.$apply(function () {
                                $scope.deliveries = finishedDelivery;
                            });
                        }
                    };

                    getV.send("");

                }
            };
            var data = JSON.stringify({"email": $('#email').val(), "password": $('#pass').val()});
            xhr.send(data);
        }
        $scope.getDeliveries();

        //Variable to store the account statement
        $scope.accountStatements = [];
        //Function to get Account statements added by admin for this buyer

        $scope.getAccountStatements = function () {
            $http({
                url: '/getAccountStatementBuyer',
                method: "GET"
            }).then(function (res) {

                    var result = res.data.data;

                    var finalStatements = [];
                    angular.forEach(result, function (statement) {
                        if (isNaN(statement.price)) {
                            statement.total = undefined;
                        } else {
                            statement.total = parseInt(statement.price) + (statement.price * statement.vat / 100);
                        }
                        finalStatements.push(statement);
                    });
                    $scope.accountStatements = finalStatements;
                },
                function (err) {
                });
        }
        $scope.getAccountStatements();

    });
