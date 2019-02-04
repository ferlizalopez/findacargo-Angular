angular.module('freeload', ['ngAutocomplete','ui.bootstrap'])
    .controller('freeloadController', function($scope,$http) {
        $scope.transrequests = {freeload:true,transtype:['Road', 'Sea', 'Air', 'Rail']};
        $scope.pickuplocation = $scope.transrequests.pickuploc;
        $scope.destlocation = $scope.transrequests.destination;
        $scope.transports = [
            'Road',
            'Sea',
            'Air',
            'Rail'
        ];
        $scope.toggleSelection = function toggleSelection(name) {
            var idx = $scope.transrequests.transtype.indexOf(name);


            if (idx > -1) {
                $scope.transrequests.transtype.splice(idx, 1);
            }


            else {
                $scope.transrequests.transtype.push(name);
            }
        };
        $scope.save = function(){
            $scope.transrequests.pickuploc = $scope.pickuploc1[0].geo;
            $scope.transrequests.pickuplocreadable = $scope.pickuploc1[0].readable;
            $scope.transrequests.destinationreadable = $scope.destination1[0].readable;
            $scope.transrequests.destination = $scope.destination1[0].geo;
            $http.post('api/transrequests', {transrequests:JSON.stringify($scope.transrequests)}).then(function(res){
                angular.forEach($scope.transports,function(transport){
                    $scope.toggleSelection(transport);
                })
                $scope.transrequests = {};
                $scope.pickuplocation = "";
                $scope.destlocation = "";
                $scope.transrequests.transtype = [];
                location.href='/listrequests';
            }, function(err){

            });
        }

        // ANGULAR DATE PICKER
        $scope.transrequests.deliveryby = new Date();
        $scope.today = function() {
            $scope.transrequests.pickupdate = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.transrequests.pickupdate = null;
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
            $scope.transrequests.pickupdate = new Date(year, month, day);
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