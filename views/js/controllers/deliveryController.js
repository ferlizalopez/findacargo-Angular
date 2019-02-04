angular.module('deliveries', [])
    .controller('deliveryController', function ($scope, $http) {
        $scope.pickup = "71.00000,76.0000";
        $scope.destination = "0.0,0.0";

        $scope.deliveries = [];

        //Function to get the list of all live vehicles
        $scope.searchDeliveries = function () {
            // api for all vehicles currently live
            $http.get('/allLiveVehicles').then(function (res) {
                getLocation(res.data.data, function (vehiclesList) {
                    $scope.deliveries = vehiclesList;
                    $scope.$apply();
                });
            }, function (err) {

            });
        }

        //Function to show the details with map of the live vehicle
        $scope.viewVehicle = function (vehicleDetails) {
            localStorage.setItem("detail", JSON.stringify(vehicleDetails));
            window.location.href = "/liveVehicleDetails";
        }

        $scope.searchDeliveries();

        function initialize() {
            autocomplete1 = new google.maps.places.Autocomplete(
                /** @type {HTMLInputElement} */(document.getElementById('origin')),
                {types: ['geocode']});
            google.maps.event.addListener(autocomplete1, 'place_changed', function () {
                origin = autocomplete1.getPlace().geometry.location;
                console.log(origin.lat());
                $scope.pickup = origin.lat() + ',' + origin.lng();
            });

        }

        initialize();

        function getLocation(data, callback) {
            var vehiclesList = [];
            angular.forEach(data, function (vehicle) {
                var coordinates = vehicle.liveDelivery.location.coordinates;
                var lat = coordinates[1];
                var lng = coordinates[0];
                var latlng = new google.maps.LatLng(lat, lng);
                var geocoder = geocoder = new google.maps.Geocoder();
                geocoder.geocode({'latLng': latlng}, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            vehicle["loc"] = results[1].formatted_address;
                        }
                    }
                    var then = new Date(vehicle.liveDelivery.location.updated_at);
                    if (vehicle.liveDelivery.location.updated_at == undefined || vehicle.liveDelivery.location.updated_at == null) {
                        then = new Date();
                    }

                    var now = new Date();

                    //var diff = moment.utc(moment(now, "DD/MM/YYYY HH:mm:ss").diff(moment(then, "DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss")
                    // var ms = moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss"));
                    // var d = moment.duration(ms);
                    // var diff = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");

                    var nowDate = moment(now);//now
                    var thenDate = moment(then);

                    console.log(nowDate.diff(thenDate, 'minutes'))
                    var diff = nowDate.diff(thenDate, 'minutes');

                    vehicle["updatedTime"] = diff;
                    vehiclesList.push(vehicle);
                    if (vehiclesList.length == data.length) {
                        callback(vehiclesList);
                    }
                });
            });
        }

    });