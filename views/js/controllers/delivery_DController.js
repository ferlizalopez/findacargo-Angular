angular.module('delivery', ['customModule'])
    .controller('delivery_DController', function($scope, $http, alert) {
        $scope.request = JSON.parse(localStorage.getItem('delivery'));
        var directionsService = new google.maps.DirectionsService(); //Create a DirectionsService object which is required to communicate with the Google Maps API Direction Service
        var map;
        $scope.OverviewForDay = [];

        //Function to get the client's routes
        $scope.getOverviewForDay = function(userId) {
            $http({
                url: '/getOverviewForDay',
                method: "GET",
                params: {
                    userId: userId
                }
            }).then(function(res) {
                    console.log(res.data.routes);
                    $scope.clientsRoute = res.data.routes;
                },
                function(err) {});
        };
        $scope.getOverviewForDay($scope.selectedClient._id);

        $scope.edit = function(edit) {
            edit.edit = true;
        };

        //Get the overvew of teh day
        $scope.getOverviewForDay = function() {
            var client = $scope.selectedClient;
            var userIds = [];
            angular.forEach(client.scheduledCarriers, function(entry) {
                userIds.push(entry.driver);
            });
            $http({
                url: '/getOverviewForDay',
                method: "GET",
                params: {
                    userIds: userIds
                }
            }).then(function(res) {
                    $scope.OverviewForDay = res.data.data;
                },
                function(err) {});
        };



        $scope.OverviewForDay = function(driver, route) {

            var client = $scope.selectedClient;

            var queryObj = {
                driverId: driver._id,
                clientId: client._id,
                routeName: route.routes && route.routes[0] && route.routes[0].vehicle_id,
                day: route.day,
                weekNo: route.week
            };

            $http.post('/OverviewForDay', {
                    data: queryObj
                })
                .then(
                    function(response) {},
                    function(response) {
                        console.log(response);
                    }
                );
        };
        $scope.getName = function(id) {
            var name;
            for (var i = 0; i < $scope.OverviewForDay.length; i++) {
                if ($scope.OverviewForDay[i]._id == id) {
                    name = $scope.OverviewForDay[i].name;
                    break;
                }
            }
            return name;
        };

        //details of delivery
        $scope.display = { distance: "", duration: "" };
        $scope.deliver = false;
        $scope.initialize = function() {
            directionsDisplay = new google.maps.DirectionsRenderer(); //Create a DirectionsRenderer object to render the directions results
            var center = new google.maps.LatLng(0, 0); //Map is centered at 0,0
            var myOptions = {
                zoom: 7,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: center
            };
            map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
            directionsDisplay.setMap(map);
            var request = {
                origin: $scope.request && $scope.request.pickup,
                destination: $scope.request && $scope.request.destination,
                travelMode: google.maps.DirectionsTravelMode.DRIVING //Current travel mode is DRIVING. You can change to BICYCLING or WALKING and see the changes.
            };
            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) //Check if request is successful.
                {
                    $scope.display.distance = response.routes[0].legs[0].distance.text;
                    $scope.display.duration = response.routes[0].legs[0].duration.text;
                    $scope.$digest();
                    directionsDisplay.setDirections(response); //Display the directions result
                }
            });
        };
        $scope.initialize();
        console.log('delivery detail', $scope.request);
    });