angular.module('helpfindload', ['ngAutocomplete', 'ui.bootstrap'])
    .controller('helpfindloadController', function($scope,$http){
        $scope.suggestions = ["Ongoing trip","Return trip"];
        $scope.allsuggestions = ["Ongoing trip","Return trip"];
        $scope.when = 'Now';
        $scope.origin = [{readable: "Islamabad, Pakistan",geo:[73.09314610000001,33.7293882]}];
        $scope.order = {when : new Date()};
        $scope.requests=[];
        $scope.loads = {pickupdate : new Date()};
        $scope.time='09:30';
        $scope.popup1 = {
            opened: false
        };
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];
        $scope.vehicleType = vehiclesType;
        $scope.selectedVehicle = $scope.vehicleType[0] && $scope.vehicleType[0].type;
        $scope.token_auth = '';
        $scope.api_url = "https://api.nemlevering.dk/v1";
        var hostname = window.location.hostname;
        if (hostname.match(/localhost/) || hostname.match(/dev/)) {
            $scope.api_url = "https://dev.api.nemlevering.dk/v1";
        }
        if(!$scope.requests.length) {
            $http.get('/api/helpfindloads').then(function(res){
                $scope.requests = res && res.data && res.data.helpfindloads;
            }, function(err){

            });
        }
        if(!$scope.token_auth){
            var xhr = new XMLHttpRequest();
            var url = $scope.api_url + "/auth/login";
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var json = JSON.parse(xhr.responseText);

                    $scope.token_auth = json.token;
                } else{
                    if(xhr.readyState == 4 && xhr.status == 505)
                    {
                        var json = JSON.parse(xhr.responseText);
                        console.log('json', json);
                        if(json && json.message){
                            alert(json.message);
                            $scope.authError = json.message;
                        }
                    }
                }
            }
            var data = JSON.stringify({"email":$('#email').val(),"password":$('#pass').val()});
            xhr.send(data);
        }

        $scope.toggleSelection = function toggleSelection(name) {
            var idx = $scope.suggestions.indexOf(name);


            if (idx > -1) {
                $scope.suggestions.splice(idx, 1);
            }


            else {
                $scope.suggestions.push(name);
            }
        };
        $scope.save = function(){
            $scope.order.creator = {_id: user._id, name: user.name};
            $scope.order.originreadable = $scope.origin[0].readable;
            $scope.order.origin = $scope.origin[0].geo;
            $scope.order.destination = $scope.destination[0].geo;
            $scope.order.destinationreadable = $scope.destination[0].readable;
            $scope.order.suggestions = $scope.suggestions;
            $scope.order.vehicle = {typeId: $scope.selectedVehicle};
            $scope.order.vehicle.description = $scope.vehicleType.find(function (d) {
                return d.type == $scope.selectedVehicle;
            }).description;
            $scope.time = document.getElementById('picktimeFrom').value;
            var timeArray = $scope.time.split(':');
            switch($scope.when){
                case 'Now':
                    var time = new Date();
                    time.setMinutes(time.getMinutes()+30);
                    $scope.order.when = time;
                    break;
                case 'Today':
                    var today = new Date();
                    today.setHours(timeArray[0],timeArray[1]);
                    $scope.order.when = today;
                    break;
                case 'Tomorrow':
                    var tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate()+1);
                    tomorrow.setHours(timeArray[0],timeArray[1]);
                    $scope.order.when = tomorrow;
                    break;
                case 'Tonight':
                    var today = new Date();
                    today.setHours(timeArray[0],timeArray[1]);
                    $scope.order.when = today;
                    break;
                case 'Next Week':
                    var today = $scope.order.when;
                    today.setHours(timeArray[0],timeArray[1]);
                    $scope.order.when = today;
                    break;
                case 'During next 2+ Weeks':
                    var today = $scope.order.when;
                    today.setHours(timeArray[0],timeArray[1]);
                    $scope.order.when = today;
                    break;
                default:
                    var time = new Date();
                    time.setMinutes(time.getMinutes()+30);
                    $scope.order.when = time;
            }
            getPriceAndAvailabilty()
        }
        $scope.close = function(){
            $('#myModalDriver').modal('toggle');
        }
        $scope.selectTime = function(){
            switch($scope.when) {
                case 'Now':
                    $('#date-cal').fadeOut();
                    $('#time-clock').fadeOut();
                    break;
                case 'Today':
                case 'Tonight':
                case 'Tomorrow':
                    $('#date-cal').fadeOut();
                    $('#time-clock').fadeIn();
                    break;
                case 'Next Week':
                    var today = new Date();
                    today.setDate(today.getDate()+7);
                    $scope.order.when = today;
                    $('#date-cal').fadeIn();
                    $('#time-clock').fadeIn();
                    break;
                case 'During next 2+ Weeks':
                    var today = new Date();
                    today.setDate(today.getDate()+14);
                    $scope.order.when = today;
                    $('#date-cal').fadeIn();
                    $('#time-clock').fadeIn();
                    break;
                default:
                    $('#date-cal').fadeOut();
                    $('#time-clock').fadeOut();
            }
        }
        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.getExpiryTime = function(request){
            request.expiresIn = '';
            var now = new Date();
            var then = + new Date(request.when);
            then = then + (request && request.duration && request.duration.value && request.duration.value * 1000);
            var expiredTime = new Date(then);
            var diff = moment.duration(moment(expiredTime).diff(moment(now)));
            var days = parseInt(diff.asDays());
            var hours = parseInt(diff.asHours());
            hours = hours - days*24;
            var minutes = parseInt(diff.asMinutes());
            minutes = minutes - (days*24*60 + hours*60);
            request.expiresIn = (days > 0 ? days + ' day' : (hours > 0 ? hours + ' hour' : minutes + ' minutes'));
            return true;
        };

        function getDurationAndDistance(){
            var directionsDisplay;
            var geocoder;
            var directionsService = new google.maps.DirectionsService();     //Create a DirectionsService object which is required to communicate with the Google Maps API Direction Service
            var map;
            $scope.display = {distance:"",duration:""};
            $scope.deliver = false;
                directionsDisplay = new google.maps.DirectionsRenderer();        //Create a DirectionsRenderer object to render the directions results
                var center = new google.maps.LatLng(0, 0);    //Map is centered at 0,0
                var myOptions =
                {
                    zoom:7,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    center: center
                }
                var request =
                {
                    origin:$scope.order && $scope.order.originreadable,
                    destination:$scope.order && $scope.order.destinationreadable,
                    travelMode: google.maps.DirectionsTravelMode.DRIVING          //Current travel mode is DRIVING. You can change to BICYCLING or WALKING and see the changes.
                };
                directionsService.route(request, function(response, status)
                {
                    if (status == google.maps.DirectionsStatus.OK) //Check if request is successful.
                    {
                        $scope.order.distance = response.routes[0].legs[0].distance;
                        $scope.order.duration = response.routes[0].legs[0].duration;
                        $scope.$digest();
                        var returnLoad = {};
                        if($scope.order.suggestions && $scope.order.suggestions.length == 2){
                            returnLoad = angular.copy($scope.order)
                            returnLoad.originreadable = $scope.order.destinationreadable;
                            returnLoad.origin = $scope.order.destination;
                            returnLoad.destinationreadable = $scope.order.originreadable;
                            returnLoad.destination = $scope.order.origin;
                            var when = + new Date($scope.order.when);
                            when = when + ($scope.order && $scope.order.duration && $scope.order.duration.value && $scope.order.duration.value * 1000);
                            returnLoad.when = new Date(when);
                        }
                        $http.post('/api/helpfindload',{helpfindload: JSON.stringify($scope.order), returnLoad: JSON.stringify(returnLoad), hostname: window.location.hostname}).then(function(res){
                            $('#myModalDriver').modal('toggle');
                            $scope.order = {when : new Date()};
                            $scope.origin = '';
                            $scope.destination = '';
                            $scope.when = 'Now';
                            $scope.selectedVehicle = $scope.vehicleType[0].type;
                            $scope.allsuggestions = ["Ongoing trip","Return trip"];
                            $scope.requests.push(res && res.data.ongoingTrip);
                            if(res && res.data && res.data.returnTrip)
                                 $scope.requests.push(res.data.returnTrip);
                            $('#date-cal').fadeOut();
                            $('#time-clock').fadeOut();
                        }, function(err){

                        });
                               //Display the directions result
                    }
                });
        }

        function getPriceAndAvailabilty(){
            if($scope.order.origin && $scope.order.destination && $scope.token_auth){
                var getV = new XMLHttpRequest();
                var pickup = $scope.order.origin[1]+","+$scope.order.origin[0];
                var drop = $scope.order.destination[1]+","+$scope.order.destination[0];
                getV.open("GET",$scope.api_url + "/carriers/availability/"+pickup+"/"+drop, true);
                getV.setRequestHeader("Content-type", "application/json");
                getV.setRequestHeader("Authorization", "JWT "+$scope.token_auth);
                getV.onreadystatechange = function () {
                    if (getV.readyState == 4 && getV.status == 200) {
                        var json = JSON.parse(getV.responseText);
                        $scope.availabeVehicles = json.available_vehicles;
                        var selectedVehicle = $scope.availabeVehicles.filter(function(vehicle){
                            return vehicle.type.id == $scope.selectedVehicle;
                        });
                        $scope.order.price = selectedVehicle[0] && selectedVehicle[0].estimated_cost;
                        getDurationAndDistance();
                    }else{
                        if(xhr.readyState == 4 && xhr.status == 505)
                        {
                            var json = JSON.parse(xhr.responseText);
                            console.log('json', json);
                            if(json && json.message){
                                alert(json.message);
                            }
                        }
                    }
                };

                getV.send("");

            } else {
                if(!$scope.token_auth){
                    alert($scope.authError);
                } else{
                    alert('Please select origin and destination');
                }
            }
        }
    });
angular.module( "ngAutocomplete", []).directive('ngAutocomplete', function($parse) {
    return {
        scope: {
            details: '=',
            ngAutocomplete: '=',
            options: '='
        },

        link: function(scope, element, attrs, model) {

            //options for autocomplete
            var opts

            //convert options provided to opts
            var initOpts = function() {
                opts = {}
                if (scope.options) {
                    if (scope.options.types) {
                        opts.types = []
                        opts.types.push(scope.options.types)
                    }
                    if (scope.options.bounds) {
                        opts.bounds = scope.options.bounds
                    }
                    if (scope.options.country) {
                        opts.componentRestrictions = {
                            country: scope.options.country
                        }
                    }
                }
            }
            initOpts()

            //create new autocomplete
            //reinitializes on every change of the options provided
            var newAutocomplete = function() {
                scope.gPlace = new google.maps.places.Autocomplete(element[0], opts);
                google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                    scope.$apply(function() {
//              if (scope.details) {
                        var place = scope.gPlace.getPlace();
                        if(place)
                        {
                            if(place.formatted_address)
                            {
                                scope.details = [{readable:place.formatted_address,geo:[place.geometry.location.lng(),place.geometry.location.lat()]}];
                            }
                            else if(place.name==""){
                                scope.details = [];
                            }
                        }
//              }
                        scope.ngAutocomplete = element.val();
                    });
                })
            }
            newAutocomplete()

            //watch options provided to directive
            scope.watchOptions = function () {
                return scope.options
            };
            scope.$watch(scope.watchOptions, function () {
                initOpts()
                newAutocomplete()
                element[0].value = '';
                scope.ngAutocomplete = element.val();
            }, true);
        }
    };
});
