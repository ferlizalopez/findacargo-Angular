angular.module('delivery', ['customModule'])
    .controller('deliveryDetailController', function($scope,$http,alert) {
        $scope.request = JSON.parse(localStorage.getItem('delivery'));
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
                origin:$scope.request && $scope.request.pickup,
                destination:$scope.request && $scope.request.destination,
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
        }
        $scope.initialize();
        console.log('delivery detail', $scope.request);
    });