angular.module('livetracking', [ 'customModule', 'ui.bootstrap'])
    .controller('liveTrackingController', function ($scope, $http, alert, $interval) {
        var directionsDisplay;
        var directionsService = new google.maps.DirectionsService;
        var map;
        $scope.accordion = -1;
        var statusInterval;
        var count = 0;
        $scope.statusConstant = deliveryStatus;
        $scope.lastExpandedRoute = '';
        $scope.routesColor = [];
        var lang = $scope.lang = i18n.detectLanguage();
        //initialization function
        function init(){
            if(lang === 'en') {
                $scope.dayDropdownArray = [{value: 'Today', description: 'Today'}, {
                    value: 'Tomorrow',
                    description: 'Tomorrow'
                }];
                $scope.selectedDay = 'Today';
            } else if(lang === 'da') {
                $scope.dayDropdownArray = [{value: 'Today', description: 'I dag'}, {
                    value: 'Tomorrow',
                    description: 'Imorgen'
                }];
                $scope.selectedDay = 'I dag';
            }
            $scope.showLiveTracking = true;
            var now = new Date();
            var currentWeek = now.getWeek();
            var day = moment(now).format('dddd');
            for (i = 2; i <= 13; i++) {
                var date = new Date();
                date.setDate(now.getDate() + i);

                var val = moment(date).format('dddd, MMM D YYYY');
                var des = moment(date).format('dddd, MMM D');
                if(lang === 'da') {

                    var dy = des.split(',');
                    switch(dy[0]) {
                        case 'Sunday':
                            dy[0] = 'Søndag';
                            break;
                        case 'Monday':
                            dy[0] = 'Mandag';
                            break;
                        case 'Tuesday':
                            dy[0] = 'Tirsdag';
                            break;
                        case 'Wednesday':
                            dy[0] = 'Onsdag';
                            break;
                        case 'Thursday':
                            dy[0] = 'Torsdag';
                            break;
                        case 'Friday':
                            dy[0] = 'Fredag';
                            break;
                        case 'Saturday':
                            dy[0] = 'Lørdag';
                            break;
                    }

                    des = dy.toString();
                    var parsed_day = {value: val, description: des};
                } else {
                    var parsed_day = {value: val, description: des};
                }

                
                console.log(val);
                $scope.dayDropdownArray.push(parsed_day)
            }
            $scope.routes = [];
            getRoutes(currentWeek, day);
        }

        //Add extra fields of deliveries carried by a route
        function arrangeDeliveriesPerRoutes(){
            if($scope.routes && $scope.routes.solution && $scope.routes.solution.routes){
                  var totalCompletion = 0;
                  var delayedMinutes = 0;
                  var aheadMinutes = 0;
                _.forEach($scope.routes.solution.routes, function(route){
                    if(route.vehicle_id == $scope.lastExpandedRoute){
                        route.viewAll = true;
                    }
                    route.activities.splice(0,1);
                    route.activities.splice((route.activities.length - 1) ,1);
                    var completeDeliveries = [];
                    _.forEach(route.activities, function(activity, index){
                        var delivery = _.filter($scope.weekPlan, function(data){
                            return activity.location_id == data.deliveryid;
                        })[0];
                        if(index == 0){
                            if(delivery.carrier && delivery.carrier.status == 7){
                                completeDeliveries.push(delivery.carrier.status);
                                var deliveryTime = _.filter(delivery.carrier.progressLog, function(progress){
                                    return progress.toStatus == 7;
                                });
                                if(deliveryTime && deliveryTime.length){
                                    delivery.deliveryTime = moment(deliveryTime[0].when).format("hh:mm A");
                                }
                            } else{
                                var now = new Date();
                                var currentTime = moment(now).format('HH:mm A');
                                if(moment(currentTime, 'HH:mm A') < moment(delivery.deliverywindowstart, 'HH:mm A') || (new Date(delivery.deliverydate)) > now){
                                    var t = moment(delivery.deliverywindowstart, 'HH:mm A');
                                    now.setHours(t.get('hour'), t.get('minute'), 0, 0);
                                }
                                var deliveryDate = new Date(now.setSeconds(now.getSeconds() + (5*60 + (activity.eta && activity.eta.arrivingInSeconds ? activity.eta.arrivingInSeconds : 0))));
                                delivery.expactedDeliveryTime = moment(deliveryDate).format('HH:mm');
                            }
                        } else {
                            if(delivery.carrier && delivery.carrier.status == 7){
                                completeDeliveries.push(delivery.carrier.status);
                                var deliveryTime = _.filter(delivery.carrier.progressLog, function(progress){
                                    return progress.toStatus == 7;
                                });
                                if(deliveryTime && deliveryTime.length){
                                    delivery.deliveryTime = moment(deliveryTime[0].when).format("hh:mm A");
                                }
                            } else{
                                var now = new Date();
                                if(route.activities[index - 1].expactedDeliveryTime){
                                    var t = moment(route.activities[index - 1].expactedDeliveryTime, 'hh:mm A');
                                    now.setHours(t.get('hour'), t.get('minute'), 0, 0);
                                }
                                var deliveryDate = new Date(now.setSeconds(now.getSeconds() + (5*60 + (activity.eta && activity.eta.arrivingInSeconds ? activity.eta.arrivingInSeconds : 0))));
                                delivery.expactedDeliveryTime = moment(deliveryDate).format('HH:mm');
                            }
                        }
                        delivery.status = delivery.carrier ? $scope.statusConstant[delivery.carrier.status] : $scope.statusConstant[0];
                        Object.assign(activity, delivery);
                        if(index == 1){
                            route.routeDate = activity.date;
                        }
                    });
                    var colors = _.filter($scope.routesColor, function(item){
                       return item.routeId == route.vehicle_id;
                    });
                    route.color = colors.length && colors[0] && colors[0].color;
                    route.completionStatus = Math.round(completeDeliveries.length * 100 / route.activities.length);
                    totalCompletion = totalCompletion + route.completionStatus;
                    getRouteStatus(route);
                    if(route.isDelay){
                        delayedMinutes = delayedMinutes + (route.minutes ? route.minutes : 0);
                    } else {
                        aheadMinutes = aheadMinutes + (route.minutes ? route.minutes : 0);
                    }
                });
                $scope.averageTime = Math.round((aheadMinutes - delayedMinutes) / $scope.routes.solution.routes.length);
                $scope.averageCompletion = Math.round(totalCompletion/$scope.routes.solution.routes.length);
            }
        }

        var getRouteStatus = function(dayRoute){
            var startTime='';
            var endTime='';
            var startedDeliveries = _.filter(dayRoute.activities, function(activity){
                return activity.carrier;
            });
            if(startedDeliveries && startedDeliveries.length){
                var progressLogs = [];
                var deliveredDeliveries = _.filter(dayRoute.activities, function(activity){
                    var deliveryTime = _.filter(activity.carrier && activity.carrier.progressLog, function(progress){
                        return  progress.toStatus == 7;
                    });
                    if(deliveryTime && deliveryTime.length){
                        progressLogs.push(deliveryTime[0].when);
                    }
                    return activity.carrier && activity.carrier.status == 7;
                });
                if(deliveredDeliveries.length == dayRoute.activities.length){
                    dayRoute.delivered = true;
                    dayRoute.status = 'Delivered';
                    var status = '';
                    var maxDeliveryWindowEnd = _.maxBy(dayRoute.activities, function(o) { return moment(o.deliverywindowend, 'HH:mm A'); });
                    var maxDeliveryTime = _.maxBy(progressLogs, function(o) {
                        return moment(o);
                    });

                    maxDeliveryTime = moment(maxDeliveryTime).format('HH:mm A');
                    if(moment(maxDeliveryWindowEnd.deliverywindowend, 'HH:mm A') < moment(maxDeliveryTime, 'HH:mm A')) {
                        status = 'delayed';
                        startTime = moment(maxDeliveryWindowEnd.deliverywindowend, 'HH:mm A');
                        endTime = moment(maxDeliveryTime, 'HH:mm A');
                        dayRoute.isDelay = true;
                        dayRoute.isDelivered = true;
                    } else {
                        status = 'ahead';
                        startTime = moment(maxDeliveryTime, 'HH:mm A');
                        endTime = moment(maxDeliveryWindowEnd.deliverywindowend, 'HH:mm A');
                    }
                    var duration = moment.duration(endTime.diff(startTime));
                    var hours = parseInt(duration.asHours());
                    var minutes = parseInt(duration.asMinutes())-hours*60;
                    dayRoute.status = dayRoute.status + '(' + (hours > 0 ? hours + ' hr ' : '') + (minutes > 0 ? minutes + ' mins ' : '') + status +')';
                    dayRoute.minutes = hours*60 + minutes;
                } else {
                    var maxDeliveryWindowEnd = _.maxBy(dayRoute.activities, function(o) { return moment(o.deliverywindowend, 'HH:mm A'); });
                    var maxDeliveryETA = _.maxBy(dayRoute.activities, function(o) { return moment(o.expactedDeliveryTime, 'HH:mm A'); });
                    if(moment(maxDeliveryWindowEnd.deliverywindowend, 'HH:mm A') < moment(maxDeliveryETA.expactedDeliveryTime, 'HH:mm A')) {
                        status = 'delayed';
                        startTime = moment(maxDeliveryWindowEnd.deliverywindowend, 'HH:mm A');
                        endTime = moment(maxDeliveryETA.expactedDeliveryTime, 'HH:mm A');
                        dayRoute.isDelay = true;
                    } else {
                        status = 'ahead';
                        startTime = moment(maxDeliveryETA.expactedDeliveryTime, 'HH:mm A');
                        endTime = moment(maxDeliveryWindowEnd.deliverywindowend, 'HH:mm A');
                    }
                    var duration = moment.duration(endTime.diff(startTime));
                    var hours = parseInt(duration.asHours());
                    var minutes = parseInt(duration.asMinutes())-hours*60;
                    dayRoute.status = (hours > 0 ? hours + ' hr ' : '') + (minutes > 0 ? minutes + ' mins ' : '') + status;
                    dayRoute.minutes = hours*60 + minutes;
                }
            } else {
                dayRoute.status = 'Waiting for Pickup';
            }
        };
        /**
        * GET route API to get routes of a day of week
        * @param week: weekNo
        * @param day: day of week
        */
        function getRoutes(week, day) {
            $interval.cancel(statusInterval);
            setMarkersUndefined();
            $http.get('/routes/'+ week + '/' + day).then(function (res) {
                if (res.data && res.data && res.data.routes) {
                    $scope.routes = res.data.routes[0];
                    $scope.weekPlan = res.data.weekPlan;
                    arrangeDeliveriesPerRoutes();
                    if($scope.routes && $scope.routes.solution && $scope.routes.solution.routes && $scope.routes.solution.routes.length){
                        drawMultipleRoutesOnMap(directionsService, $scope.routes && $scope.routes.solution && $scope.routes.solution.routes, function(routeResponseArray){
                            var colorCodeArray = ['#0000FF', '#8A2BE2', '#A52A2A', '#DEB887', '#5F9EA0', '#7FFF00', '#D2691E', '#DC143C', '#006400', '#2F4F4F'];
                            _.forEach(routeResponseArray, function(response, index){
                                var polylineOptionsActual = {
                                    strokeColor: response.color,
                                    strokeOpacity:1.0,
                                    strokeWeight: 3
                                };
                                directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true, polylineOptions: polylineOptionsActual});
                                directionsDisplay.setMap(map);
                                directionsDisplay.setDirections(response.response);
                            });
                            if($scope.selectedDay == 'Today'){
                                statusInterval = $interval(function(){
                                    liveTracking(week, day);
                                }, 10000);
                            }
                        });
                    } else {
                        document.getElementById('map_canvas').innerHTML = '';
                    }
                }
            }, function (err) {

            });
        }

        function setMarkersUndefined(){
            if($scope.routes && $scope.routes.solution && $scope.routes.solution.routes){
                _.forEach($scope.routes.solution.routes, function(route){
                    $scope[route.vehicle_id] =  undefined;
                });
            }
        }

        function liveTracking(week, day){
            $http.get('/routes/'+ week + '/' + day).then(function (res) {
                if (res.data && res.data && res.data.routes) {
                    $scope.routes = angular.copy(res.data.routes[0]);
                    $scope.weekPlan = angular.copy(res.data.weekPlan);
                    arrangeDeliveriesPerRoutes();
                    var routes = angular.copy(res.data.routes[0]);
                    var weekPlan = angular.copy(res.data.weekPlan);
                    $scope.completionStatus = Math.round(res.data.completionStatus);
                    if($scope.completionStatus >= 100){
                        $interval.cancel(statusInterval);
                    }
                    findStartedRoute(routes, weekPlan);
                }
            }, function (err) {

            });
        }

        function findStartedRoute(routes, scheduledDeliveries){
            if(routes && routes.solution && routes.solution.routes){
                var startedRoutesArray = [];
                _.forEach(routes.solution.routes, function(route){
                    route.activities.splice(0,1);
                    route.activities.splice((route.activities.length - 1) ,1);
                    _.forEach(route.activities, function(activity, index){
                        var delivery = _.filter(scheduledDeliveries, function(data){
                            return activity.location_id == data.deliveryid;
                        })[0];
                        if(index == 0){
                            if(delivery && delivery.carrier && delivery.carrier.vehicle && delivery.carrier.vehicle.id){
                                startedRoutesArray.push({routeId: route.vehicle_id, pickupCoordinates: delivery.pickupcoordinates, vehicleId: delivery.carrier.vehicle.id})
                            }
                        }
                        delivery.status = delivery.carrier ? $scope.statusConstant[delivery.carrier.status] : $scope.statusConstant[delivery.status];
                    });
                });
            }
            getVehicleLocation(startedRoutesArray);
        }

        function getVehicleLocation(vehicles){
            $http.get('/location?vehicles='+ JSON.stringify(vehicles)).then(function (res) {
                if (res && res.data && res.data.vehicles) {
                    var liveVehicleLocation = res.data.vehicles;
                    updateMarkerLocation(liveVehicleLocation);
                }
            }, function (err) {

            });
        }

        function updateMarkerLocation(liveVehicleLocation){
            _.forEach(liveVehicleLocation, function(vehicle){
                if(vehicle.location && vehicle.locationCoordinates){
                    if($scope[vehicle.routeId] == undefined){
                        $scope[vehicle.routeId] = new google.maps.Marker({
                            position: {lat: vehicle.pickupCoordinates[1], lng: vehicle.pickupCoordinates[0]},
                            icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                fillColor: 'red',
                                fillOpacity: 0.8,
                                scale: 8,
                                strokeColor: 'white',
                                strokeWeight: 5
                            },
                            map: map
                        });
                    } else {
                        moveMarker($scope[vehicle.routeId], vehicle.locationCoordinates);
                    }

                }
            });
        }

        function moveMarker(marker, coordinates){
            marker.setPosition( new google.maps.LatLng( coordinates[1], coordinates[0] ) );
            //map.panTo( new google.maps.LatLng( coordinates[1], coordinates[0] ) );
        }

        function drawMultipleRoutesOnMap(directionsService, routes, callback){
            console.log('Am i being called twice?');
            var routesResponseArray = [];
            var center = new google.maps.LatLng(55.67, 12.56);    //Map is centered at 0,0
            var myOptions =
            {
                zoom:16,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: center
            };
            map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
            _.forEach(routes, function(route, index){
                var waypts = [];
                var startAddress = [];
                var destinationAddress = [];
                var colorCodeArray = ['#0000FF', '#8A2BE2', '#A52A2A', '#DEB887', '#5F9EA0', '#7FFF00', '#D2691E', '#DC143C', '#006400', '#2F4F4F'];
                startAddress = route && route.activities && route.activities.length && route.activities[1] && route.activities[1].pickupcoordinates;
                destinationAddress =  route && route.activities && route.activities.length && route.activities[route.activities.length-2] && route.activities[route.activities.length-2].deliverycoordinates;
                if(index == 0 && startAddress.length){
                    var marker = new google.maps.Marker({
                        position: {lat: startAddress[1], lng: startAddress[0]},
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
                    var marker = new google.maps.Marker({
                        position: {lat: startAddress[1], lng: startAddress[0]},
                        map: map,
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            fillColor: 'red',
                            fillOpacity: 0.8,
                            scale: 8,
                            strokeColor: 'white',
                            strokeWeight: 5
                        }
                    });
                }
                var pinMarker = new Marker({
                    map: map,
                    position: {lat: destinationAddress[1], lng: destinationAddress[0]},
                    icon: {
                        path: '',
                        fillColor: '#000000',
                        fillOpacity: 1,
                        strokeColor: '',
                        strokeWeight: 0
                    },
                    draggable:true,
                    map_icon_label: "<span class='map-icon map-icon-map-pin on-map' style='color:" + colorCodeArray[index] + "'" + "></span> <span style='position: absolute;top: 7px;font-size: 19px;color: white;display: block;left: 19px; font-weight: bold;font-family: sans-serif;font-style: normal;'>" + route.activities.length + "</span>"
                });
                route.color = colorCodeArray[index];
                $scope.routesColor.push({routeId: route.vehicle_id, color: colorCodeArray[index]});
                _.forEach(route.activities, function(delivery, activityIndex){
                    if(delivery.deliverycoordinates && delivery.deliverycoordinates.length){
                        if(activityIndex % 4 == 0){
                            var cityCircle = new google.maps.Circle({
                                strokeColor: colorCodeArray[index],
                                strokeOpacity: 1.0,
                                strokeWeight: 7,
                                fillColor: colorCodeArray[index],
                                fillOpacity: 1.0,
                                map: map,
                                center: {lat: delivery.deliverycoordinates[1], lng: delivery.deliverycoordinates[0]},
                                radius: 30,
                                scale: 10
                            });
                            waypts.push({location: new google.maps.LatLng(delivery.deliverycoordinates[1],delivery.deliverycoordinates[0]), stopover: true})
                        }
                    }
                });
                waypts.push({location: new google.maps.LatLng(destinationAddress[1], destinationAddress[0]), stopover: true});

                directionsService.route({
                    origin: new google.maps.LatLng(startAddress && startAddress.length && startAddress[1], startAddress && startAddress.length && startAddress[0]),
                    destination: new google.maps.LatLng(destinationAddress && destinationAddress.length && destinationAddress[1], destinationAddress && destinationAddress.length && destinationAddress[0]),
                    waypoints: waypts,
                    optimizeWaypoints: true,
                    travelMode: 'DRIVING'
                }, function(response, status) {
                    if (status === 'OK') {
                        routesResponseArray.push({response: response, color: colorCodeArray[index]});
                        // For each route, display summary information.
                    } else {
                        routesResponseArray.push({});
                        console.log('Directions request failed due to ' + status, response);
                    }
                    if(routes.length == routesResponseArray.length){
                        callback(routesResponseArray);
                    }
                });
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

        function calculateRoute(route, index) {


        }
        /*
         * function to get the week of a year from a date
         */
        Date.prototype.getWeek = function() {
            var date = new Date(this.getTime());
            date.setHours(0, 0, 0, 0);
            // Thursday in current week decides the year.
            date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
            // January 4 is always in week 1.
            var week1 = new Date(date.getFullYear(), 0, 4);
            // Adjust to Thursday in week 1 and count number of weeks from date to week1.
            return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                - 3 + (week1.getDay() + 6) % 7) / 7);
        };


        /**
         * function to get date from selected day
         */
        function getDateFromSelectedDay(){
            var currentWeek, day;
            if(lang === 'en') {
                switch($scope.selectedDay){
                    case ('Today'):
                        var date = new Date();
                        break;
                    case 'Tomorrow':
                        var date = new Date();
                        date.setDate(date.getDate() + 1);
                        break;
                    default:
                        var date = new Date($scope.selectedDay);
                }
                return date;    
            } else if(lang === 'da') {
                switch($scope.selectedDay){
                    case 'I dag':
                        var date = new Date();
                        break;
                    case 'Imorgen':
                        var date = new Date();
                        date.setDate(date.getDate() + 1);
                        break;
                    default:
                        var date = new Date($scope.selectedDay);
                }
                return date;  
            }
            
        };


        /**
        * function to get route by selected day dropdown
        */
        $scope.getRoutesSelectedDay = function(value){
            $scope.selectedDay = value;
            var currentWeek, day;
            $scope.accordion = -1;
            $scope.deliveries = [];
            $scope.searchText = '';
            switch($scope.selectedDay){
                case 'Today':
                    var now = new Date();
                    now = new Date(now.setHours(0,0,0,0));
                    currentWeek = now.getWeek();
                    day = moment(now).format('dddd');
                    $scope.showLiveTracking = true;
                    break;
                case 'Tomorrow':
                    var date = new Date();
                    date.setDate(date.getDate() + 1);
                    date = new Date(date.setHours(0,0,0,0));
                    currentWeek = date.getWeek();
                    day = moment(date).format('dddd');
                    $scope.showLiveTracking = false;
                    break;
                default:
                    var date = new Date($scope.selectedDay);
                    day = moment(date).format('dddd');
                    currentWeek = date.getWeek();
                    $scope.showLiveTracking = false;
            }
            getRoutes(currentWeek, day);
        };

        $scope.viewAll = function(route){
            route.viewAll = true;
            $scope.lastExpandedRoute = route.vehicle_id;
        };

        $scope.expandRoute = function(index){
            _.forEach($scope.routes.solution.routes, function(route){
                route.viewAll = false;
            });
            $scope.accordion = index;
        };

        $scope.viewDetail = function(delivery, driver, index) {
            delivery.index = index < 10 ? '0' + (index + 1) : (index + 1);
            localStorage.setItem('scheduleDelivery',JSON.stringify(delivery));
            localStorage.setItem('driver',JSON.stringify(driver));
            window.location.href = "/deliveryLiveTracking";
        };

        $scope.searchDeliveries = function(searchText){
            if(!searchText){
                $scope.deliveries = [];
            } else {
                var date = getDateFromSelectedDay();

                $http.get('/search/deliveries/'+ searchText,{params:{date:date}}).then(function (res) {
                    if (res && res.data && res.data.deliveries) {
                        $scope.deliveries = res.data.deliveries;
                        _.forEach($scope.deliveries, function(delivery){
                            delivery.showMatchedFields = [];
                            delivery.status = (delivery.carrier && delivery.carrier.status ? $scope.statusConstant[delivery.carrier.status] : $scope.statusConstant[0]);
                            if(delivery.recipientname && (delivery.recipientname.toLowerCase()).includes(searchText.toLowerCase())){
                                delivery.showMatchedFields.push('Client Name');
                                delivery.showSuggestion = delivery.recipientname;
                            }
                            if(delivery.recipientclientid && (delivery.recipientclientid.toLowerCase()).includes(searchText.toLowerCase())){
                                delivery.showMatchedFields.push('Client ID');
                                delivery.showSuggestion = delivery.recipientclientid;
                            }
                            if(delivery.recipientemail && (delivery.recipientemail.toLowerCase()).includes(searchText.toLowerCase())){
                                delivery.showMatchedFields.push('Client Email');
                                delivery.showSuggestion = delivery.recipientemail;
                            }
                            if(delivery.deliveryaddress && (delivery.deliveryaddress.toLowerCase()).includes(searchText.toLowerCase())){
                                delivery.showMatchedFields.push('Address');
                                delivery.showSuggestion = delivery.deliveryaddress;
                            }
                            if(delivery.carrier && delivery.carrier.status == 9){
                                var status = '';
                                var now = new Date();
                                var currentTime = moment(now).format('HH:mm A');
                                if(moment(currentTime, 'HH:mm A') < moment(delivery.deliverywindowstart, 'HH:mm A') || (new Date(delivery.deliverydate)) > now){
                                    var t = moment(delivery.deliverywindowstart, 'HH:mm A');
                                    now.setHours(t.get('hour'), t.get('minute'), 0, 0);
                                }
                                var deliveryDate = new Date(now.setSeconds(now.getSeconds() + (5*60 + (delivery.eta && delivery.eta.arrivingInSeconds ? delivery.eta.arrivingInSeconds : 0))));
                                delivery.estimatedDeliveryTime = moment(deliveryDate).format('hh:mm A');
                                if(moment(delivery.deliverywindowend, 'HH:mm A') < moment(delivery.estimatedDeliveryTime, 'HH:mm A')) {
                                    status = 'behind';
                                    /*startTime = moment($scope.scheduleDelivery.deliverywindowend, 'HH:mm A');
                                     endTime = moment($scope.scheduleDelivery.deliveryTime, 'HH:mm A');*/
                                    delivery.isDelay = true;

                                    delivery.minutes = Math.round((delivery.eta && delivery.eta.arrivingInSeconds ? delivery.eta.arrivingInSeconds : 0) / 60);
                                    console.log('delayed', delivery.minutes);
                                }
                            }
                        });
                    }
                }, function (err) {

                });
            }
        };
        init();
    });
