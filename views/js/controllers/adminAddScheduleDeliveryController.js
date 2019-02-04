angular.module('addScheduleDelivery', ['ngAutocomplete', 'ui.bootstrap'])
    .controller('adminAddScheduleDeliveryController', function ($scope, $http, $timeout) {

        /*$scope.error = '';
        $scope.success = '';
        $scope.pickupAddress = [{readable: "Islamabad, Pakistan", geo: [73.09314610000001, 33.7293882]}];
        $scope.pickupDeadline = '07:00';
        $scope.windowStart = '07:00';
        $scope.windowEnd = '16:00';*/

        function init() {
            $scope.scheduledSetting = scheduledSetting;
            $scope.selectedClient = JSON.parse(localStorage.getItem('selectedClient'));
            $scope.routeDetails = JSON.parse(localStorage.getItem('routeDetails'));
            $scope.positionArray = [];
            $scope.delivery={};
            $scope.deliveryOrder = '1';
            $scope.success = "";
            $scope.error = "";
            for(position = 1; position <= $scope.routeDetails.totalActivities + 1; position++){
                $scope.positionArray.push(position);
            }
            $scope.positionArray.push('Re-plan order of the route automatically');
        }
        $scope.submit = function (isValid) {
            if (isValid) {
                var clientId = $scope.selectedClient && $scope.selectedClient._id;
                $scope.delivery.pickupaddress = ($scope.routeDetails.delivery && $scope.routeDetails.delivery.pickupaddress) || ($scope.scheduledSetting && $scope.scheduledSetting.pickupAddress && $scope.scheduledSetting.pickupAddress.length && $scope.scheduledSetting.pickupAddress[0].readable);
                $scope.delivery.pickupcoordinates =  ($scope.routeDetails.delivery && $scope.routeDetails.delivery.pickupcoordinates) || ($scope.scheduledSetting && $scope.scheduledSetting.pickupAddress && $scope.scheduledSetting.pickupAddress.length && $scope.scheduledSetting.pickupAddress[0].geo);
                $scope.delivery.pickupcity = ($scope.routeDetails.delivery && $scope.routeDetails.delivery.pickupcity);
                $scope.delivery.pickupzip = ($scope.routeDetails.delivery && $scope.routeDetails.delivery.pickupzip);
                $scope.delivery.pickupdeadline = $scope.delivery.pickupdeadline || ($scope.scheduledSetting && $scope.scheduledSetting.pickupDeadline);
                $scope.delivery.deliverywindowstart = $scope.delivery.deliverywindowstart || ($scope.scheduledSetting && $scope.scheduledSetting.windowStart);
                $scope.delivery.deliverywindowend = $scope.delivery.deliverywindowend || ($scope.scheduledSetting && $scope.scheduledSetting.windowEnd);
                $scope.delivery.weekno = $scope.routeDetails.delivery && $scope.routeDetails.delivery.weekno;
                $scope.delivery.deliverydayofweek = $scope.routeDetails.delivery && $scope.routeDetails.delivery.deliverydayofweek;
                $scope.delivery.deliverydate = $scope.routeDetails.delivery && $scope.routeDetails.delivery.deliverydate;
                    $http.put('/api/addScheduledDeliveryAndReplanningRoute/'+clientId, {requestPayload: {delivery: $scope.delivery, routeDetails: $scope.routeDetails, deliveryOrder: $scope.deliveryOrder}}).then(function(res){
                    if(res.data.error_code === 0){
                        $scope.resetForm();
                        $scope.success = 'Delivery is saved successfully';
                        $timeout(function () {
                            $scope.success = "";
                        }, 4000);
                    } else {
                        $scope.error = res.data.description;
                        $timeout(function () {
                            $scope.error = "";
                        }, 3000);
                    }
                }, function(err){
                    console.log(err);
                    $scope.error = 'Some error occurred while saving scheduled delivery';
                    $timeout(function () {
                        $scope.error = "";
                    }, 3000);
                });
            }
        };

        $scope.resetForm = function () {
            $scope.delivery = {};
            $scope.deliveryOrder = '1';
        };
        init();
    }).directive('preventEnterFireing', function() {
        return {
            link: function(scope, element, attrs) {
                element.keypress(function(e) {
                    if (e.keyCode == 13) {
                        e.preventDefault();
                        return;
                    }
                });
            }
        }
    });



angular.module("ngAutocomplete", []).directive('ngAutocomplete', function ($parse) {
    return {
        scope: {
            details: '=',
            coordinates: '=',
            ngAutocomplete: '=',
            options: '='
        },
        link: function (scope, element, attrs, model) {

            //options for autocomplete
            var opts;

            //convert options provided to opts
            var initOpts = function () {
                opts = {};
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
            initOpts();

            //create new autocomplete
            //reinitializes on every change of the options provided
            var newAutocomplete = function () {
                scope.gPlace = new google.maps.places.Autocomplete(element[0], opts);
                google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
                    scope.$apply(function () {
//              if (scope.details) {
                        var place = scope.gPlace.getPlace();
                        if (place) {
                            if (place.formatted_address) {
                                console.log('22222222222', place,scope.gPlace);
                                scope.details = place.formatted_address;
                                scope.coordinates = [place.geometry.location.lng(), place.geometry.location.lat()];

                                /*[{
                                    readable: place.formatted_address,
                                    geo: [place.geometry.location.lng(), place.geometry.location.lat()]
                                }];*/
                            }
                            else if (place.name == "") {
                                scope.details = [];
                            }
                        }
//              }
                        scope.ngAutocomplete = element.val();
                    });
                })
            }
            newAutocomplete();

            //watch options provided to directive
            scope.watchOptions = function () {
                return scope.options
            };
            scope.$watch(scope.watchOptions, function () {
                initOpts();
                newAutocomplete();
                element[0].value = '';
                scope.ngAutocomplete = element.val();
            }, true);
        }
    };
});

