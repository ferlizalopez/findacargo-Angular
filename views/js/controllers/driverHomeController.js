angular.module('driverHome', ['ngAutocomplete'])
    .controller('driverHomeController', function($scope,$http) {
        $scope.suggestions = ["Ongoing trip", "Return trip"];
        $scope.allsuggestions = ["Ongoing trip", "Return trip"];
        $scope.when = 'Now';
        $scope.origin = [{readable: "Islamabad, Pakistan",geo:[73.09314610000001,33.7293882]}];
        $scope.order = {};
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
            $scope.order.originreadable = $scope.origin[0].readable;
            $scope.order.origin = $scope.origin[0].geo;
            $scope.order.destination = $scope.destination[0].geo;
            $scope.order.destinationreadable = $scope.destination[0].readable;
            $scope.order.suggestions = $scope.suggestions;
            switch($scope.when){
                case 'Now':
                    var time = new Date();
                    time.setMinutes(time.getMinutes()+30);
                    $scope.order.when = time;
                    break;
                case 'Today':
                    var today = new Date();
                    today.setHours(23,59);
                    $scope.order.when = today;
                    break;
                case 'Tomorrow':
                    var tomorrow = new Date();
                    tomorrow.setHours(23,59);
                    tomorrow.setTime(tomorrow.getTime()+86400000);
                    $scope.order.when = tomorrow;
                    break;
                case 'Day After Tomorrow':
                    var today = new Date();
                    today.setHours(23,59);
                    today.setTime(today.getTime()+2*86400000);
                    $scope.order.when = today;
                    break;
                case 'Next Week':
                    var today = new Date();
                    today.setHours(23,59);
                    today.setTime(today.getTime()+7*86400000);
                    $scope.order.when = today;
                    break;
                case 'During Next 2+ Weeks':
                    var today = new Date();
                    today.setHours(23,59);
                    today.setTime(today.getTime()+2*86400000);
                    $scope.order.when = today;
                    break;
                default:
                    var time = new Date();
                    time.setMinutes(time.getMinutes()+30);
                    $scope.order.when = time;
            }
            $http.post('/api/helpfindload',{helpfindload:JSON.stringify($scope.order)}).then(function(res){
                $scope.order = {};
                $scope.origin = '';
                $scope.destination = '';
                $scope.when = '';
            }, function(err){

            });
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