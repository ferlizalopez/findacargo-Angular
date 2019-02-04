angular.module('deals', ['customModule'])
    .controller('dailyDealsController', function($scope,$http,alert) {
        $scope.deals = [];
        if(!$scope.deals.length){
            $http.get('/api/helpfindloads').then(function(res){
                $scope.deals = res && res.data && res.data.helpfindloads;
            }, function(err){

            });
        }

        $scope.enquire = function(deal){
            $http.put('/api/enquireDeals', {deal:deal, hostname: window.location.hostname}).then(function(res){
                alertA = res.data;
            }, function(err){

            });
        }

        $scope.getPrice = function(price){
            if(price){
                return (price * 60 / 100).toFixed(2);
            } else {
                return 'NA';
            }

        }
    });