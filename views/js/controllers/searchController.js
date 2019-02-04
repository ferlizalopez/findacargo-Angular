angular.module('search', ['ngAutocomplete','ui.bootstrap','customModule'])
    .controller('trequestsController', function($scope,$http,alert){
        $scope.transRequests = [];
        $scope.deliveries = [];
        $scope.query = {};
        $scope.numberAlerts=alert.getNotificationscount;
        $scope.alertNotifications = alert.getNotifications;
        $scope.showAll = false;
        $scope.more = false;
        $scope.alerts = [];
        $scope.location = $scope.query.pickUpLoc;
        $scope.ignoreList = JSON.parse(localStorage.getItem("ignore"))?JSON.parse(localStorage.getItem("ignore")):[];
        var hostname = window.location.hostname;
        $scope.apiUrl = 'https://api.nemlevering.dk/v1';
        if (hostname.match(/localhost/) || hostname.match(/dev/)) {
            $scope.apiUrl = 'https://dev.api.nemlevering.dk/v1';
        }
        $scope.showAllTransReuests =  function () {
            if(!$scope.transRequests.length){
                $http.get('/api/transrequestss?mode=marketplace').then(function(res){
                    $scope.transRequests = res.data.transrequestss;
                }, function(err){

                });
            }
        }

        /*
        * Fetch today's Live deliveries with status carrier pending and scheduled
        */
        if(!$scope.deliveries.length){
            $http.get('/tDelivery').then(function(res){
                if(res.data && res.data && res.data.deliveries && res.data.deliveries.length){
                    $scope.deliveries = res.data.deliveries;
                }
            }, function(err){

            });
        }
        $scope.testPush = function(){
            $http.post('/notifydriver', {}).then(function(res){

            }, function(err){
            });
        }

        $scope.putSearchAlert = function(){
                $scope.query.creator = user._id;
                $scope.query.location = $scope.query.pickUpLoc;
                if($('#fromdate').val()=='Any Date'){
                $scope.query.when = 'Any Date';
                }
                else{
                $scope.query.when = new Date(angular.element(document.getElementById('fromdate')).val());
                $scope.query.time = 'Anytime';
                //                if(angular.element(document.getElementById('picktime')).val()!='Anytime'){
                //                $scope.alert.when.setHours(angular.element(document.getElementById('picktime')).val().split(':')[0],angular.element(document.getElementById('picktime')).val().split(':')[1]);
                //                }
                //                else{
                //
                //                }
                }

                $http.post('/api/alert', {alert:JSON.stringify($scope.query)}).then(function(res){
                                                                                    $scope.query = {};
                                                                                    $scope.location = '';
                                                                                    $scope.alerts.push(res.data);
                                                                                    }, function(err){



                                                                                    });
                window.location.href = "/alerts";


                };

        $scope.addNotification = function(){
            alert.addNotification();
        }
        $scope.createAlert = function(){
                window.location.href = "/alerts";
        }
        $scope.showIgnored = function(val){
            $scope.showAll = val;
        }
        $scope.viewDelivery = function(delivery){
            localStorage.setItem('delivery',JSON.stringify(delivery));
            window.location.href = "/deliveryDetail";
        }

        $scope.view = function(details){
            localStorage.setItem("detail", JSON.stringify(details));
            window.location.href = "/details";
        }
        $scope.ignore = function(req){
            $scope.ignoreList.push(req._id);
            localStorage.setItem("ignore", JSON.stringify($scope.ignoreList));
            //$scope.transRequests.splice($scope.transRequests.indexOf(req),1);
        }
        $scope.unIgnore = function(req){
            $scope.ignoreList.splice($scope.ignoreList.indexOf(req._id),1);
            localStorage.setItem("ignore", JSON.stringify($scope.ignoreList));
        };
        $scope.search = function(){
            if($('#fromdate').val()!='Anytime')
            $scope.query.date = new Date(angular.element(document.getElementById('fromdate')).val());
            else
                $scope.query.date = 'Anytime';
            $http.post('/api/transrequestss',{querypar:JSON.stringify($scope.query)}).then(function(res){
                $scope.transRequests = res.data.transrequests;
            }, function(err){

            });
        };

        $scope.getCarrieTransrequest = function (readable,geo) {
            var query = {};
            var pickUpLoc = [];
            pickUpLoc.push({'readable':readable,'geo':geo})
            query.date = 'Anytime';
            query.pickUpLoc = pickUpLoc;
            query.distance = 100;

            $http.post('/api/transrequestss',{querypar:JSON.stringify(query)}).then(function(res){
                $scope.transRequests = res.data.transrequests;
            }, function(err){

            });
        }

        /**
        * Creating request payload to insert accepted delivery in carrier's cargo
        * @param request: delivery to be accepted
        * @param id: user id
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
         * accept delivery
         * @param request: delivery to be accepted
         * @param index: delivery index
         */
        $scope.accept = function(request, index){

            var deliveryId = request._id;
            $http.post('/carrier/acceptDelivery/'+deliveryId, {delivery: request}).then(function(res){
                if(res && res.status == 200){
                    var payload = createPayload(request, $('#ids').val());
                    $http.get('/carrier/cargo/count').then(function(res){
                        if(res && res.data && res.data.cargoCount){
                            res.data.cargoCount = res.data.cargoCount + 1;
                            payload.name = '00' + res.data.cargoCount;
                            payload.deliveryId = '00' + res.data.cargoCount;
                        }
                        $http.post('/carrier/cargo/createDelivery', {delivery: payload}).then(function(res){
                            $scope.deliveries.splice(index, 1);
                        }, function(err){

                        });
                    }, function(err){

                    });
                }
            });
        };

        /**
         * reject delivery
         * @param request: delivery to be accepted
         * @param index: delivery index
         */
        $scope.reject = function(delivery, index) {
            var deliveryId = delivery._id;
            $http.post('/carrier/rejectDelivery/' + deliveryId).then(function(res){
                $scope.deliveries.splice(index, 1);
            }, function(err){

            })
        };

        // ANGULAR DATE PICKER

        $scope.today = function() {
            $scope.query.date= new Date();
            $scope.query.date.setHours(0,0,0,0);
        };
        $scope.today();
        $scope.clear = function() {
            $scope.query.date = null;
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };

        $scope.toggleMin();
        $scope.maxDate = new Date(2020, 5, 22);

        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };

        $scope.setDate = function(year, month, day) {
            $scope.query.date = new Date(year, month, day);
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        $scope.events =
            [
                {
                    date: tomorrow,
                    status: 'full'
                },
                {
                    date: afterTomorrow,
                    status: 'partially'
                }
            ];

        $scope.getDayClass = function(date, mode) {
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,0,0,0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        };
        $scope.initialize = function()
        {
            var loc = document.getElementById('userHq').value;
            var geo = [];
            var geocoder = new google.maps.Geocoder();

            geocoder.geocode( { "address": loc }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var latitude = results[0].geometry.location.lat();
                    var longitude = results[0].geometry.location.lng();

                    geo.push(longitude);
                    geo.push(latitude);

                    $scope.getCarrieTransrequest(loc,geo);

                } else {
                    $scope.getCarrieTransrequest(loc,geo);
                    try {
                        console.error("Geocode was not successful for the following reason: " + status);
                    } catch (e) {
                    }
                }
            });
        }
        $scope.initialize();
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