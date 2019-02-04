angular.module('bids', ['customModule'])
    .controller('bidController', function ($scope, $http, alert) {
        $scope.request = JSON.parse(localStorage.getItem('requestbids'));
        $scope.accept = function (request, bid) {
            request.bidAction = bid;
            request.bidAction.accepted = true;
            request.bidAction.rejected = false;
            $http.put('/api/transrequests/' + request._id, {transrequests: JSON.stringify(request)}).then(function (res) {
                localStorage.setItem('requestbids', JSON.stringify(res.data));
            }, function (err) {
            });
        };
        $scope.reject = function (request, bid) {
            request.bidAction = bid;
            request.bidAction.accepted = false;
            request.bidAction.rejected = true;
            $http.put('/api/transrequests/' + request._id, {transrequests: JSON.stringify(request)}).then(function (res) {
                localStorage.setItem('requestbids', JSON.stringify(res.data));
            }, function (err) {
            });
        };
    });