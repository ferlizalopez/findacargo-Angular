angular.module('accountStatement', [])
    .controller('accountStatementController', function ($scope, $http) {

        //variable to hold the current selected user.
        $scope.selectedUser = userId;

        //Variable to store the account statement
        $scope.accountStatements = [];

        //Function to get Account statements added by admin for this buyer

        $scope.getAccountStatements = function () {
            $http({
                url: '/getAccountStatementBuyer',
                method: "GET",
                params: {userId: $scope.selectedUser}
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