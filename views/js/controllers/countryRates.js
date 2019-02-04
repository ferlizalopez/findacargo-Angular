angular.module('adminRates', [])
    .controller('countryRates', function ($scope, $http) {
        $scope.countryRates = [];
        $scope.countries = [];
        $scope.addCountryRate = function (countryCode, vehicle, basePrice, pricePerKm) {
            var countryName = "";
            for(var i = 0; i < $scope.countries.length; i++ ) {
                if($scope.countries[i].code == countryCode) {
                    countryName = $scope.countries[i].name;
                }
            }
            $http.post('/createCountryRate', { countryCode: countryCode,countryName:countryName,vehicle:vehicle,basePrice:basePrice,pricePerKm:pricePerKm }).then(function (res) {
                $scope.getAllCountryRates();
                $scope.country = "";
                $scope.vehicle = "";
                $scope.basePrice = "";
                $scope.pricePerKm = "";
            }, function (err) {

            });
        }

        $scope.getAllCountryRates = function () {
            $http.get('/getAllcountryRates').then(function (res) {
                $scope.countryRates = res.data.data;
                $scope.countries =  res.data.countries;

            }, function (err) {
            });
        }

        $scope.removeCountryRate = function (id) {
            $http.delete('/removeCountryRate/'+id+'').then(function (res) {
                $scope.getAllCountryRates();
            }, function (err) {
            });
        }       
        
        $scope.getAllCountryRates();

        $scope.edit = function(rate){
            rate.edit = true;
        };
        $scope.editAction = function(rate,type){
            if(type){
                rate.edit = false;
                $http.put('/updateCountryRate/'+rate._id, {rate:rate}).then(function(res){
                    console.log(res.data);
                }, function(err){

                });
            }
            else{
                rate.edit = false;
            }
        };
    });