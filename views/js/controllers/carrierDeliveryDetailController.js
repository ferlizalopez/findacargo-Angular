angular.module('carrierDelivery', ['customModule'])
    .controller('carrierDeliveryDetailController', function($scope,$http,alert) {
        var directionsDisplay;
        var geocoder;
        var directionsService = new google.maps.DirectionsService();     //Create a DirectionsService object which is required to communicate with the Google Maps API Direction Service
        var map;
        $scope.display = {distance:"",duration:""};
        $scope.deliver = false;
        $scope.initialize = function()
        {
            directionsDisplay = new google.maps.DirectionsRenderer();        //Create a DirectionsRenderer object to render the directions results
            var center = new google.maps.LatLng(0, 0);    //Map is centered at 0,0
            var myOptions =
            {
                zoom:7,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: center
            }
            map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
            directionsDisplay.setMap(map);
            var request =
            {
                origin:$scope.request && $scope.request.pickUp && $scope.request.pickUp.description,
                destination:$scope.request && $scope.request.dropOff && $scope.request.dropOff.description,
                travelMode: google.maps.DirectionsTravelMode.DRIVING          //Current travel mode is DRIVING. You can change to BICYCLING or WALKING and see the changes.
            };
            directionsService.route(request, function(response, status)
            {
                if (status == google.maps.DirectionsStatus.OK) //Check if request is successful.
                {
                    $scope.display.distance = response.routes[0].legs[0].distance.text;
                    $scope.display.duration = response.routes[0].legs[0].duration.text;
                    $scope.$digest();
                    directionsDisplay.setDirections(response);         //Display the directions result
                }
            });
            if($scope.request && $scope.request.pickUp && $scope.request.pickUp.location && $scope.request.pickUp.location.length){
                var latlng = new google.maps.LatLng($scope.request.pickUp.location[1], $scope.request.pickUp.location[0]);
                getPostalCode(latlng, 'pickup');
            }
            if($scope.request && $scope.request.dropOff && $scope.request.dropOff.location && $scope.request.dropOff.location.length){
                var latlng = new google.maps.LatLng($scope.request.dropOff.location[1], $scope.request.dropOff.location[0]);
                getPostalCode(latlng, 'destination');
            }

        }

        $scope.request = JSON.parse(localStorage.getItem('delivery'));
        $scope.initialize();

        function getPostalCode(latlng, location){
            geocoder = new google.maps.Geocoder();
            geocoder.geocode({'latLng': latlng}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        for (j = 0; j < results[0].address_components.length; j++) {
                            if (results[0].address_components[j].types[0] == 'postal_code'){
                                if(location == 'pickup'){
                                    $scope.pickupPostalCode = results[0].address_components[j].short_name + ' ';
                                } else {
                                    $scope.destinationPostalCode = results[0].address_components[j].short_name + ' ';
                                }
                            } else if(results[0].address_components[j].types[0] == 'locality'){
                                if(location == 'pickup'){
                                    $scope.pickupCity = results[0].address_components[j].long_name + ' ';
                                } else {
                                    $scope.destinationCity = results[0].address_components[j].long_name + ' ';
                                }
                            } else if(results[0].address_components[j].types[0] == 'country'){
                                if(location == 'pickup'){
                                    $scope.pickupCountry = results[0].address_components[j].long_name;
                                } else {
                                    $scope.destinationCountry = results[0].address_components[j].long_name;
                                }
                            }
                            $scope.$apply();
                        }
                    }
                } else {
                    alert("Geocoder failed due to: " + status);
                }
            });
        }
        /**
        * preparing request payload of accepted delivery to make it a cargo delivery
        * @param request
        * @param id: user Id
        */
        function createPayload(request, id){
            var payload = {};
            //payload.acceptedDelivery = true;
            payload.name = '001';
            payload.clientID = request && request.buyer && request.buyer.accountId;
            payload.deliveryId = '001';
            payload.origin = request && request.pickUp && request.pickUp.description;
            payload.destination = request && request.dropOff && request.dropOff.description;
            payload.pickupDate = request && request.pickUp && request.pickUp.pickupDate;
            payload.deliveryDate = request && request.pickUp && request.pickUp.pickupDate;
            payload.originLatLng = {type:"Point", coordinates:request && request.pickUp && request.pickUp.location},
                payload.destLatLng = {type:"Point", coordinates:request && request.pickUp && request.dropOff.location},
                payload.status = 0;
            payload.userID = id;
            payload.groupId = $('#groupId').val();
            return payload;
        }

        /**
        * accept delivery and then add that delivery into carrier's delivery
        */
        $scope.accept = function(){

            var deliveryId = $scope.request._id;
            $http.post('/carrier/acceptDelivery/'+deliveryId).then(function(res){
                if(res && res.status == 200){
                    var payload = createPayload($scope.request, $('#ids').val());
                    $http.get('/carrier/cargo/count').then(function(res){
                        if(res && res.data && res.data.cargoCount){
                            res.data.cargoCount = res.data.cargoCount + 1;
                            payload.name = '00' + res.data.cargoCount;
                            payload.deliveryId = '00' + res.data.cargoCount;
                        }
                        $http.post('/carrier/cargo/createDelivery', {delivery: payload}).then(function(res){
                            window.location.href = "/search";
                        }, function(err){

                        });
                    }, function(err){

                    });
                }
            });
        };

        /**
         * reject delivery
         */
        $scope.reject = function() {
            var deliveryId = $scope.request._id;
            $http.post('/carrier/rejectDelivery/' + deliveryId).then(function(res){
                window.location.href = "/search";
            }, function(err){

            })
        };
    });