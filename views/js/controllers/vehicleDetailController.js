angular.module('details', ['customModule'])
    .controller('detailsController', function($scope,$location,$http,$sce,alert) {
        var directionDisplay;

        var map;
        $scope.deliver = false;
        $scope.initialize = function(loc)
        {


            var geocoder = new google.maps.Geocoder();

            geocoder.geocode( { "address": loc }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {

                    var myOptions = {
                        zoom: 12,
                        center: results[0].geometry.location,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

                    // Add a marker at the address.
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                    });

                } else {
                    try {
                        console.error("Geocode was not successful for the following reason: " + status);
                    } catch (e) {
                    }
                }
            });
        }

        $scope.detail = JSON.parse(localStorage.getItem("detail"));
        $scope.initialize($scope.detail.loc);
        $scope.mapSrc = $sce.trustAsResourceUrl("https://www.google.com/maps/embed/v1/directions?origin="+$scope.detail.pickuplocreadable+"&destination="+$scope.detail.destinationreadable+"&key=AIzaSyC4L6iMK1Kyw2fYOYgnRZ6AEaaMb6y_RVI");


    });