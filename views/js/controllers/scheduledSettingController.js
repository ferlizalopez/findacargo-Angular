angular.module('scheduledSetting', ['ngAutocomplete', 'ui.bootstrap'])
    .controller('scheduledSettingController', function ($scope, $http, $timeout) {
        $scope.error = '';
        $scope.success = '';
        $scope.pickupAddressReadable = "";
        $scope.pickupAddress = [{readable: "Islamabad, Pakistan", geo: [73.09314610000001, 33.7293882]}];
        $scope.pickupDeadline = '07.00';
        $scope.windowStart = '07.00';
        $scope.windowEnd = '16:00';
        $scope.selectedClient = JSON.parse(localStorage.getItem('selectedClient'));
        $scope.submit = function (isValid) {
            if (isValid) {
                var scheduledSetting = {};
                var clientId = $scope.selectedClient && $scope.selectedClient._id;
                $scope.pickupAddressReadable = $scope.scheduledSetting.pickupAddress[0].readable;
                scheduledSetting.pickupAddress = $scope.pickupAddress;
                scheduledSetting.pickupDeadline = $scope.pickupDeadline;
                scheduledSetting.windowStart = $scope.windowStart;
                scheduledSetting.windowEnd = $scope.windowEnd;
                scheduledSetting.isEmail = $scope.isEmail || false;
                scheduledSetting.isSMS = $scope.isSMS || false;


                $http.put('/updateScheduledSetting/'+clientId, {scheduledSetting: scheduledSetting}).then(function(res){
                    if(res.data.error_code === 0){
                        $scope.resetForm();
                        $scope.success = 'Scheduled setting saved successfully';
                        $timeout(function () {
                            $scope.success = "";
                        }, 4000);
                    } else {
                        $scope.error = 'Some error occurred while saving scheduled setting';
                        $timeout(function () {
                            $scope.error = "";
                        }, 3000);
                    }
                }, function(err){
                    console.log(err);
                    $scope.error = 'Some error occurred while saving scheduled setting';
                    $timeout(function () {
                        $scope.error = "";
                    }, 3000);
                });
            }
        };

        $scope.resetForm = function () {
            $scope.pickupAddress = [];
            $scope.pickupDeadline = '07.00';
            $scope.windowStart = '07.00';
            $scope.windowEnd = '16:00';
        };
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
                                scope.details = [{
                                    readable: place.formatted_address,
                                    geo: [place.geometry.location.lng(), place.geometry.location.lat()]
                                }];
                                scope.pickupAddressReadable = place.formatted_address
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
