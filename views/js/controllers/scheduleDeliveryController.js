
angular.module('scheduleDelivery', ['customModule', 'ui.bootstrap'])
    .controller('scheduleDeliveryController', function ($scope, $http, alert, $interval) {
        var directionsDisplay;
        var directionsService = new google.maps.DirectionsService;
        var map;
        var statusInterval;
        var marker1, marker2;
        $scope.scheduleDelivery = JSON.parse(localStorage.getItem('scheduleDelivery'));
        $scope.language = i18n.detectLanguage();

        $scope.statusConstant = scheduledStatus;
        //console.log($scope.scheduleDelivery, $scope.scheduleDelivery.deliverydate, $scope.statusConstant);

        function init() {
            directionsDisplay = new google.maps.DirectionsRenderer();        //Create a DirectionsRenderer object to render the directions results
            var center = new google.maps.LatLng(0, 0);    //Map is centered at 0,0
            var myOptions =
            {
                zoom: 7,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: center
            }
            $scope.deliveryDate = new Date($scope.scheduleDelivery && $scope.scheduleDelivery.deliverydate);
            $scope.now = new Date();
            $scope.now.setDate($scope.now.getDate() + 1);
            $scope.tomorrow = (new Date($scope.now.setHours(0, 0, 0, 0)));
            getDeliveryStatus($scope.scheduleDelivery._id);
            if ($scope.deliveryDate < $scope.tomorrow) {
                $scope.showLiveTracking = true;
                statusInterval = $interval(function () {
                    getDeliveryStatus($scope.scheduleDelivery._id);
                }, 10000);
            }
            map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
            directionsDisplay.setMap(map);
            var pickup = $scope.scheduleDelivery && $scope.scheduleDelivery.pickupcoordinates;
            var destination = $scope.scheduleDelivery && $scope.scheduleDelivery.deliverycoordinates;
            if (pickup && pickup.length) {
                currentLocationMarker(pickup);
            }
            if (destination && destination.length) {
                var pinMarker = new Marker({
                    map: map,
                    position: {lat: destination[1], lng: destination[0]},
                    icon: {
                        path: '',
                        fillColor: '#000000',
                        fillOpacity: 1,
                        strokeColor: '',
                        strokeWeight: 0
                    },
                    draggable:true,
                    map_icon_label: "<span class='map-icon map-icon-map-pin on-map' style='color:rgba(237,85,81,1)'></span> <span style='position: absolute;top: 7px;font-size: 19px;color: white;display: block;left: 19px; font-weight: bold;font-family: sans-serif;font-style: normal;'>" + $scope.scheduleDelivery.index + "</span>"
                });
            }
            var polylineOptionsActual = {
                strokeColor: 'rgba(237,85,81,1)',
                strokeOpacity: 1.0,
                strokeWeight: 3
            };
            directionsService.route({
                origin: new google.maps.LatLng(pickup && pickup.length && pickup[1], pickup && pickup.length && pickup[0]),
                destination: new google.maps.LatLng(destination && destination.length && destination[1], destination && destination.length && destination[0]),
                travelMode: 'DRIVING'
            }, function (response, status) {
                if (status === 'OK') {
                    directionsDisplay = new google.maps.DirectionsRenderer({
                        suppressMarkers: true,
                        polylineOptions: polylineOptionsActual
                    });
                    directionsDisplay.setMap(map);
                    directionsDisplay.setDirections(response);
                } else {
                    console.log('Directions request failed due to ' + status);
                }
            });
        }

        function getDeliveryStatus(id) {
            $http.get('/livestatus/' + id).then(function (res) {
                if (res && res.data) {
                    $scope.scheduleDeliveryStatus = $scope.statusConstant[res.data.status];
                    $scope.scheduleDelivery.driver = res.data.driver;
                    if(res.data.status == 7){
                        var deliveryTime = _.filter(res.data.progressLog, function(progress){
                            return progress.toStatus == 7;
                        });
                        if(deliveryTime && deliveryTime.length){
                            var startTime='';
                            var endTime='';
                            var status = '';
                            $scope.scheduleDelivery.deliveryTime = moment(deliveryTime[0].when).format("hh:mm A");
                            if(moment($scope.scheduleDelivery.deliverywindowend, 'HH:mm A') < moment($scope.scheduleDelivery.deliveryTime, 'HH:mm A')) {
                                status = 'behind';
                                startTime = moment($scope.scheduleDelivery.deliverywindowend, 'HH:mm A');
                                endTime = moment($scope.scheduleDelivery.deliveryTime, 'HH:mm A');
                                $scope.scheduleDelivery.isDelay = true;
                            } else {
                                status = 'ahead';
                                startTime = moment($scope.scheduleDelivery.deliveryTime, 'HH:mm A');
                                endTime = moment($scope.scheduleDelivery.deliverywindowend, 'HH:mm A');
                            }
                            var duration = moment.duration(endTime.diff(startTime));
                            var hours = parseInt(duration.asHours());
                            var minutes = parseInt(duration.asMinutes())-hours*60;
                            $scope.scheduleDelivery.statusTime = (hours > 0 ? hours + ' hr ' : '') + (minutes > 0 ? minutes + ' mins ' : '') + status;
                            $scope.scheduleDelivery.minutes = hours*60 + minutes;
                        }
                    } else{
                        if($scope.scheduleDelivery.expactedDeliveryTime && res.data.status == 0){
                            $scope.scheduleDelivery.estimatedDeliveryTime = moment($scope.scheduleDelivery.expactedDeliveryTime, ["h:mm A"]).format("HH:mm");
                        } else {
                            var now = new Date();
                            var currentTime = moment(now).format('HH:mm A');
                            if(moment(currentTime, 'HH:mm A') < moment($scope.scheduleDelivery.deliverywindowstart, 'HH:mm A') || (new Date($scope.scheduleDelivery.deliverydate)) > now){
                                var t = moment($scope.scheduleDelivery.deliverywindowstart, 'HH:mm A');
                                now.setHours(t.get('hour'), t.get('minute'), 0, 0);
                            }
                            var deliveryDate = new Date(now.setSeconds(now.getSeconds() + (5*60 + (res.data.eta && res.data.eta.arrivingInSeconds ? res.data.eta.arrivingInSeconds : 0))));
                            $scope.scheduleDelivery.estimatedDeliveryTime = moment(deliveryDate).format('HH:mm A');
                        }
                    }
                    if (res.data.location) {
                        //currentLocationMarker(res.data.locationCoordinates);
                        moveMarker(marker1, res.data.locationCoordinates);
                        moveMarker(marker2, res.data.locationCoordinates);
                        $scope.scheduleDelivery.arrivingIn = res.data.eta && res.data.eta.arrivingIn;
                    }
                    if (res.data.status == 7) {
                        $interval.cancel(statusInterval);
                    }
                } else {
                    $scope.scheduleDeliveryStatus = 'Waiting for Pickup'
                }
            }, function (error) {
                $scope.scheduleDeliveryStatus = 'Waiting for Pickup'
            });
        }

        function moveMarker(marker, coordinates) {
            marker.setPosition(new google.maps.LatLng(coordinates[1], coordinates[0]));
            //map.panTo( new google.maps.LatLng( coordinates[1], coordinates[0] ) );
        }

        function currentLocationMarker(coordinates) {
            marker1 = new google.maps.Marker({
                position: {lat: coordinates[1], lng: coordinates[0]},
                map: map,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: 'rgba(110,208,230,0.5)',
                    fillOpacity: 0.05,
                    scale: 20,
                    strokeColor: 'rgba(110,208,230,0.5)',
                    strokeWeight: 20
                }
            });
            marker2 = new google.maps.Marker({
                position: {lat: coordinates[1], lng: coordinates[0]},
                map: map,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: 'rgba(237,85,81,1)',
                    fillOpacity: 0.8,
                    scale: 7,
                    strokeColor: 'white',
                    strokeWeight: 5
                }
            });
        }

        function pinSymbol(color) {
            return {
                path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
                fillColor: color,
                fillOpacity: 1.0,
                strokeColor: color,
                strokeOpacity: 1.0,
                strokeWeight: 1,
                scale: 1
            };
        }

        init();
    });
