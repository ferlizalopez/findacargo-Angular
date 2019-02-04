angular.module('recentOrders', ['ngAutocomplete','ui.bootstrap','customModule'])
    .controller('ordersController', function($scope,$http,alert){
        $scope.transRequests = [];
        $scope.query = {};
        $scope.numberAlerts=alert.getNotificationscount;
        $scope.alertNotifications = alert.getNotifications;
        $scope.showAll = false;
        $scope.more = false;
        $scope.alerts = [];
        $scope.location = $scope.query.pickUpLoc;
        $scope.ignoreList = JSON.parse(localStorage.getItem("ignore"))?JSON.parse(localStorage.getItem("ignore")):[];

        $scope.getAllTransRequest = function () {
            if (!$scope.transRequests.length) {
                $http.get('/api/transrequestss?mode=marketplace').then(function (res) {
                    $scope.transRequests = res.data.transrequestss;
                }, function (err) {

                });
            }
        };
        $scope.getAllTransRequest();

        $scope.deliveryFilter = "";
        $scope.deliveries = [];
        $scope.paymentFilters = [];
        $scope.deliveryFilters = [];

        $scope.getAllDeliveries = function () {
            $scope.deliveryFilters = [];
            // api for get all deliveries for admin
            $http.get('/adminDeliveries').then(function (res) {
                //$scope.deliveries = res.data.data;
                var allDeliveries = res.data.data;
                var deliveryArr = [];

                $scope.statusEnum = res.data.statusEnum;
                angular.forEach(allDeliveries, function (delivery) {
                    if(delivery.status != 7 && delivery.status != 5) {
                        delivery.statusDes = $scope.statusEnum.STATUS_DESCRIPTION[delivery.status];
                        deliveryArr.push(delivery);
                    }
                });
                $scope.deliveries = deliveryArr;
                for (var key in $scope.statusEnum.STATUS_DESCRIPTION) {
                    $scope.deliveryFilters.push($scope.statusEnum.STATUS_DESCRIPTION[key]);

                }
                //$scope.$apply();

            }, function (err) {

            });
        };
        $scope.getAllDeliveries();

        $scope.getPaymentStatus = function (paymentObj) {

            if(paymentObj) {
                switch (paymentObj.status) {
                    case 2:

                        var result = paymentObj.externalRequests.filter(function( obj ) {
                            return obj.type == 'REFUND_OR_CANCEL';
                        });
                        if(result) {
                            return 'Returned';
                        } else {
                            return 'Payment Authorized'
                        }
                        break;
                    case 6:
                        return 'Captured';
                        break;
                    default:
                        return 'N/A';
                }
            } else {
                return 'N/A';
            }
        }

        $scope.removeAdminDelivery = function(id) {
            console.log(id);
            bootbox.confirm("Are you Sure you want to delete!", function (confirmation) {
                if(confirmation) {
                    $http.delete('/removeAdminDelivery/'+ id).then(function(res){
                        $scope.getAllDeliveries();
                    }, function(err){

                    });
                }
            });
        }

        $scope.removeRequest = function (id) {
            bootbox.confirm("Are you Sure you want to delete!", function (confirmation) {
                if (confirmation) {
                    $http.delete('/api/transrequests/' + id).then(function (res) {
                        $scope.getAllTransRequest();
                    }, function (err) {

                    });
                }
            });
        }
        //function to assign delivery to a carrier.
        $scope.assignToCarrier = function (delivery) {
            localStorage.setItem("adminDelivery", JSON.stringify(delivery));
            window.location.href = "/adminAssignCarrierDelivery";

        };

        $scope.view = function(details){
            localStorage.setItem("detail", JSON.stringify(details));
            window.location.href = "/details";
        }
        $scope.viewDelivery = function(details){
            var updatedDetails = {};
            updatedDetails["pickupdate"] = details.pickUp.pickupDate;
            updatedDetails["budget"] = details["price"];
            updatedDetails["destinationreadable"] = details.dropOff.description;
            updatedDetails["pickuplocreadable"] = details.pickUp.description;
            updatedDetails["cargotype"] = details.vehicleType.description;
            updatedDetails["name"] = details.buyer.name;

            localStorage.setItem("detail", JSON.stringify(updatedDetails));
            window.location.href = "/details";
        }


    }).filter('filterByPayment', function () {
    return function (items,paymentFilter) {
        console.log('---------',paymentFilter);
        if(paymentFilter) {
            switch (paymentFilter) {
                case 'Returned':
                    var finalResult = [];
                    var result = items.filter(function( obj ) {
                        return obj.paymentStatus && obj.paymentStatus.status == 2;
                    });
                    result.forEach(function(item){
                        var statusArr = item.paymentStatus.externalRequests.filter(function( obj ) {
                            return obj.type == 'REFUND_OR_CANCEL';
                        });
                        if(statusArr.length) {
                            finalResult.push(item);
                        }

                    });
                    return finalResult;
                    break;
                case 'Payment Authorized':
                    var finalResult = [];
                    var result = items.filter(function( obj ) {
                        if(obj.paymentStatus && obj.paymentStatus.status == 2) {
                            obj.paymentStatus.externalRequests.forEach(function (item) {
                                if(item.type == 'REFUND_OR_CANCEL') {
                                    return true;
                                }
                            });
                            return false;
                        }
                    });
                    // result.forEach(function(item){
                    //     var statusArr = item.paymentStatus.externalRequests.filter(function( obj ) {
                    //         return (obj.type == 'AUTHORIZE');
                    //
                    //     });
                    //
                    //     if(statusArr.length) {
                    //         finalResult.push(item);
                    //     }
                    // });
                    return result;
                    break;
                case 'Captured':
                    var result = items.filter(function( obj ) {
                        return obj.paymentStatus && obj.paymentStatus.status == 6;
                    });
                    return result;
                    break;
                default:
                    return 'N/A';
            }
        } else {
            return items;
        }
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