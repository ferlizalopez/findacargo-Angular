angular.module('alert', ['ngAutocomplete', 'ui.bootstrap', 'customModule'])
    .controller('buyerAlertController', function($scope, $http, $timeout, alert) {
        $scope.alert = {};
        $scope.place = '';
        $scope.result1 = '';
        $scope.options1 = null;
        $scope.alert.alertType = '';
        $scope.alert.alertBy = '';
        $scope.numberAlerts = alert.getNotificationscount;
        $scope.alertNotifications = alert.getNotifications;
        $scope.details1 = '';
        $scope.showAlerts = false;
        $scope.alerts = [];
        $scope.location = $scope.alert.location;
        $scope.toLocation = $scope.alert.toLocation;
        $scope.alert.isAlertOnOpportunity = true;
        $scope.alert.isAlertDailyDigest = true;
        $scope.vehicleType = vehiclesType;
        $scope.selectedVehicle = ($scope.vehicleType[0].typeId).toString();
        $scope.query = {};
        if (!$scope.alerts.length) {
            $http.get('/api/alerts').then(function(res) {
                $scope.alerts = res.data.alerts;
            }, function(err) {

            });
        }
        $scope.view = function(details) {
            localStorage.setItem("detail", JSON.stringify(details));
            window.location.href = "/details";
        };

        $scope.putAlert = function() {
            $scope.alert.creator = user._id;
            $scope.alert.isBuyer = true;
            $scope.alert.vehicle = {
                typeId: $scope.selectedVehicle
            };
            $scope.alert.vehicle.description = $scope.vehicleType.find(function(d) {
                return d.typeId == $scope.selectedVehicle;
            }).description;
            getAlertType($scope.alert.alertType, $scope.alert);
            getAlertBy($scope.alert.alertBy, $scope.alert);
            console.log('alert information', $scope.alert);
            $http.post('/api/buyeralert', {
                alert: JSON.stringify($scope.alert)
            }).then(function(res) {
                $scope.alert = {};
                $scope.location = '';
                $scope.toLocation = '';
                $scope.alert.isAlertOnOpportunity = true;
                $scope.alert.isAlertDailyDigest = true;
                $scope.alert.isAlertByEmail = true;
                $scope.alert.isAlertBySms = true;
                $scope.alerts.push(res.data);
            }, function(err) {

            });
        };



        $scope.toggleView = function() {
            $scope.showAlerts = true;
        };
        $scope.edit = function(alert, index) {
            alert.edit = true;
            $scope.editLocation = alert.location;
            $scope.editToLocation = alert.toLocation;
            $timeout(function() {
                $('#reportrangeFrom' + index).daterangepicker({
                    "singleDatePicker": true,
                    "autoApply": true,
                    "startDate": "01/01/2016"
                }, function(start, end, label) {
                    $('#fromdate' + index).val(start.format('MM-DD-YYYY'));
                    $('#anyDate' + index).html(start.format('MMMM D, YYYY'));
                });

            }, 500);
        };
        $scope.editAction = function(alertA, type, index) {
            if (type) {
                alertA.edit = false;
                getAlertType(alertA.alertType, alertA);
                getAlertBy(alertA.alertBy, alertA);
                alertA.vehicle.description = $scope.vehicleType.find(function(d) {
                    return d.typeId == alertA.vehicle.typeId;
                }).description;
                console.log('editing data', alertA);
                $http.put('/api/alert/' + alertA._id, {
                    alert: JSON.stringify(alertA)
                }).then(function(res) {
                    alertA = res.data;
                }, function(err) {

                });
            } else {
                alertA.edit = false;
            }
        };
        $scope.remove = function(alertA) {
            bootbox.confirm("Are you Sure you want to delete!", function(confirmation) {
                if (confirmation) {
                    $http.delete('/api/alert/' + alertA._id).then(function(res) {
                        if (res.status == 204) {
                            $scope.alerts.splice($scope.alerts.indexOf(alertA), 1);
                            $scope.alert.isEmailAlert = true;
                            $scope.alert.isSmsAlert = true;
                        }
                    }, function(err) {

                    });
                }
            });
        };
        $scope.viewAlerts = function() {
            $scope.showAlerts = false;
            if (!$scope.alerts.length) {
                $http.get('/api/alerts').then(function(res) {
                    $scope.alerts = res.data.alerts;
                }, function(err) {

                });
            }
        };

        // ANGULAR DATE PICKER

        $scope.today = function() {
            $scope.alert.date = new Date();
            $scope.alert.date.setHours(0, 0, 0, 0);
        };
        $scope.today();
        $scope.clear = function() {
            $scope.alert.date = null;
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
            $scope.alert.date = new Date(year, month, day);
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
        $scope.events = [{
            date: tomorrow,
            status: 'full'
        }, {
            date: afterTomorrow,
            status: 'partially'
        }];

        $scope.getDayClass = function(date, mode) {
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        };

        function getAlertType(alertType, obj) {
            switch (alertType) {
                case 'Every time':
                    obj.isAlertOnOpportunity = true;
                    obj.isAlertDailyDigest = false;
                    break;
                case 'Daily Digest':
                    obj.isAlertDailyDigest = true;
                    obj.isAlertOnOpportunity = false;
                    break;
                default:
                    obj.isAlertOnOpportunity = true;
                    obj.isAlertDailyDigest = true;
            }
        }

        function getAlertBy(alertBy, obj) {
            switch (alertBy) {
                case 'By Email':
                    obj.isAlertByEmail = true;
                    obj.isAlertBySms = false;
                    break;
                case 'By SMS':
                    obj.isAlertBySms = true;
                    obj.isAlertByEmail = false;
                    break;
                default:
                    obj.isAlertBySms = true;
                    obj.isAlertByEmail = true;
            }
        }

    });
angular.module("ngAutocomplete", []).directive('ngAutocomplete', function($parse) {
    return {

        scope: {
            details: '=',
            ngAutocomplete: '=',
            options: '='
        },

        link: function(scope, element, attrs, model) {

            //options for autocomplete
            var opts;

            //convert options provided to opts
            var initOpts = function() {
                opts = {};
                if (scope.options) {
                    if (scope.options.types) {
                        opts.types = [];
                        opts.types.push(scope.options.types);
                    }
                    if (scope.options.bounds) {
                        opts.bounds = scope.options.bounds;
                    }
                    if (scope.options.country) {
                        opts.componentRestrictions = {
                            country: scope.options.country
                        };
                    }
                }
            };
            initOpts();

            //create new autocomplete
            //reinitializes on every change of the options provided
            var newAutocomplete = function() {
                scope.gPlace = new google.maps.places.Autocomplete(element[0], opts);
                google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                    scope.$apply(function() {
                        //              if (scope.details) {
                        var place = scope.gPlace.getPlace();
                        if (place) {
                            if (place.formatted_address) {
                                scope.details = [{
                                    readable: place.formatted_address,
                                    geo: [place.geometry.location.lng(), place.geometry.location.lat()]
                                }];
                            } else if (place.name === "") {
                                scope.details = [];
                            }
                        }
                        //              }
                        scope.ngAutocomplete = element.val();
                    });
                });
            };
            newAutocomplete();

            //watch options provided to directive
            scope.watchOptions = function() {
                return scope.options;
            };
            scope.$watch(scope.watchOptions, function() {
                initOpts();
                newAutocomplete();
                element[0].value = '';
                scope.ngAutocomplete = element.val();
            }, true);
        }
    };
});