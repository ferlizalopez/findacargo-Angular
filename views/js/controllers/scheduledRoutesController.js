//TTN
angular.module('scheduledRoutes', ['ngAutocomplete','ngFileUpload', 'ui.bootstrap', 'angular.chosen'])
    .controller('scheduledRoutesController', ['Upload', '$window', '$scope', '$http', '$timeout', function (Upload, $window, $scope, $http, $timeout) {

        $scope.selectedClient = JSON.parse(localStorage.getItem('selectedClient'));
        $scope.scheduledSetting = $scope.selectedClient && $scope.selectedClient.scheduledSetting && $scope.selectedClient.scheduledSetting.pickupAddress;
        $scope.week = '';
        $scope.error = '';
        $scope.replace = '';
        $scope.fileError = "";
        $scope.existError = "";
        $scope.success = "";
        $scope.loader = false;
        $scope.routeError = "";
        $scope.progressBar = false;

        $scope.progress = 0;
        $scope.fileName = "";
        $scope.fileSize = "";
        $scope.addressCorrection = false;
        //as deliveries are already planned.
        $scope.uploadOption = '0';

        $scope.mappingArray = [
            {value: 'deliveryid', description: 'DeliveryID'},
            {value: 'recipientclientid', description: 'Client ID'},
            {value: 'recipientname', description: 'Client Name'},
            {value: 'recipientphone', description: 'Client Phone'},
            {value: 'recipientemail', description: 'Client Email'},
            {value: 'pickupaddress', description: 'Pickup Address'},
            {value: 'deliveryaddress', description: 'Delivery Address'},
            {value: 'pickupdeadline', description: 'Pickup Deadline'},
            {value: 'deliverydayofweek', description: 'Delivery Day of week'},
            {value: 'deliverywindowstart', description: 'Delivery window start'},
            {value: 'deliverywindowend', description: 'Delivery window end'},
            {value: 'deliverylabel', description: 'Delivery Label'},
            {value: 'deliverynumberofpackages', description: 'Number of packages'},
            {value: 'deliverynotes', description: 'Delivery Notes'}
        ];

        $scope.deliveryKeys = {};
        $scope.allDeliveries = [];


        Date.prototype.getWeek = function () {
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

        // Function to format the bytes
        function formatBytes(bytes, decimals) {
            if (bytes == 0) return '0 Bytes';
            var k = 1000,
                dm = decimals + 1 || 3,
                sizes = ['Bytes', 'KB', 'MB'],
                i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }

        function weeksToDate(y, w, d) {
            var simple = new Date(y, 0, 1 + (w - 1) * 7);
            var dow = simple.getDay();
            var ISOweekStart = simple;
            if (dow <= 4)
                ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
            else
                ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
            ISOweekStart.setDate(ISOweekStart.getDate() + d);
            return ISOweekStart;
        };
        $scope.currentWeekNo = (new Date()).getWeek();
        $scope.selectedWeek = $scope.currentWeekNo;
        $scope.lastWeekNo = (new Date('12/31/' + (new Date().getFullYear()))).getWeek();

        $scope.weekArray = [];
        //$scope.weekArray.push({value:'',description:'-- select week --'});
        for (i = $scope.currentWeekNo; i <= $scope.lastWeekNo; i++) {
            var option = 'Week ' + i + ' - ' + moment(weeksToDate(new Date().getFullYear(), i, 0)).format('DD/MM') + ' to ' + moment(weeksToDate(new Date().getFullYear(), i, 6)).format('DD/MM');
            $scope.weekArray.push({value: i, description: option});
        }


        //function to call on form submit
        $scope.submit = function (isValid) {
            $scope.fileError = "";
            $scope.existError = "";
            if (isValid) {
                if ($scope.week == '') {
                    $scope.fileError = 'Please select a week.';
                } else {
                    console.log('inside upload');
                    //check delivereis already there for that week in db
                    $http({
                        url: '/api/checkDeliveryForWeek',
                        method: "POST",
                        data: {'weeks': $scope.week}
                    }).then(function (res) {
                            if (res.data.exist && !$scope.replace) {
                                $scope.existError = "Deliveries already exists for that week,please click on checkbox to replace them.";
                            } else {
                                if (!res.data.exist && $scope.replace) {
                                    $scope.existError = "Deliveries doesn't exists for selected weeks,please uncheck the replace checkbox.";
                                } else {
                                    if (res.data && res.data.existsWeek) {
                                        var routesWeek = _.differenceBy($scope.week, res.data.existsWeek, function (week) {
                                            return week.toString();
                                        });
                                        $scope.upload($scope.file, routesWeek);
                                    } else {
                                        $scope.upload($scope.file, $scope.week);
                                    }
                                }
                            }
                        },
                        function (err) {
                        });
                }
            }
        };

        $scope.routesWeek = '';

        $scope.upload = function (file, routesWeek) {
            $scope.routesWeek = routesWeek;
            $scope.progressBar = true;
            $scope.fileError = "";
            $scope.routeError = "";
            $scope.addressError = [];
            Upload.upload({
                url: '/api/deliveriesUpload',
                method: 'POST',
                data: {
                    file: file
                }
            }).then(function (resp) {
                if (resp.data.error_code === 0) {
                    $scope.resetForm();

                    $scope.progressBar = false;
                    $scope.fieldsView = true;

                    $scope.allDeliveries = resp.data.data.data;
                    $scope.deliveryKeys = Object.assign({}, $scope.allDeliveries && $scope.allDeliveries[0]);
                } else {
                    if (resp.data.fileError) {
                        $scope.fileError = resp.data.fileError;
                        $scope.errorCode = resp.data.error_code;
                    } else if (resp.data.routeError) {
                        $scope.routeError = resp.data && resp.data.err_desc;
                    } else if (resp.data.addressError) {
                        $scope.addressError = resp.data.addressError;
                        $scope.errorCode = resp.data.error_code;
                    } else {
                        $scope.fileError = resp.data && resp.data.err_desc;
                    }
                }
            }, function (err) {
                console.log(err);
            }, function (evt) {
                //console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                $scope.progress = progressPercentage;
                $scope.fileName = evt.config.data.file.name;
                $scope.fileSize = formatBytes(evt.config.data.file.size);
            });
        };
        $scope.resetForm = function () {
            document.getElementById('upload_form').reset();
            $scope.replace = '';
            $('.chosen-select').val('').trigger('chosen:updated');

        };
        $scope.onFileSelect = function () {
            $scope.fileError = "";
            $scope.routeError = "";
            $scope.addressError = [];
            $scope.existError = "";
        };

        $scope.mappingObj = {};
        $scope.mappingObjArr = [];
        $scope.createMapping = function (key, value) {
            $scope.mappingObj[key] = value;
        };

        $scope.next = function () {
            _.forEach($scope.allDeliveries, function (delivery) {
                _.forEach($scope.mappingObj, function (key, value) {
                    delivery[key] = delivery[value];
                    delete delivery[value];
                });

                if (_.isEmpty(delivery.pickupaddress)) {
                    if ($scope.scheduledSetting && $scope.scheduledSetting.length) {
                        delivery.pickupaddress = $scope.scheduledSetting[0].readable;
                        delivery.pickupcoordinates = $scope.scheduledSetting[0].geo;
                    } else {
                        $scope.error = 'No pickup address';
                    }
                }
            });

            //validate mapping and data
            checkMapping($scope.allDeliveries[0],function (error,success) {
                if(error) {
                    $scope.mappingError = error.error;
                    $scope.progressBar = false;
                    $scope.fieldsView = true;
                    $scope.addressCorrection = false;
                    $window.scrollTo(0, 0);
                } else {
                    validateDeliveriesData($scope.allDeliveries, function (deliveryError,success) {
                        if(deliveryError){
                            $scope.fileError = deliveryError && deliveryError.fileError;
                            $scope.errorCode = deliveryError && deliveryError.error_code;
                            $scope.progressBar = false;
                            $scope.fieldsView = false;
                            $scope.addressCorrection = false;
                        } else {
                            //validate addresses
                            $http.post('/api/validateAddress', {
                                    deliveries: $scope.allDeliveries
                                })
                                .then(
                                    function (response) {
                                        if (response.data && response.data.error_code == 1) {
                                            console.log('error in addressses',response);
                                            if (response.data && response.data.data == 'invalid_pickup_address') {

                                                $scope.fileError = 'Pickup address is mandatory.'
                                                $scope.errorCode = 2;
                                                $scope.progressBar = false;
                                                $scope.fieldsView = false;
                                                $scope.addressCorrection = false;

                                            } else {
                                                $scope.wrongDeliveries = response.data && response.data.data;
                                                showAddressCorrection();
                                            }
                                        } else {
                                            $scope.finalSaveDeliveries(response.data && response.data.data);
                                        }
                                    },
                                    function (err) {
                                        console.log(err);
                                    }
                                );
                        }
                    });
                }
            });

        }

        //Finally save the deliveries TTN
        $scope.finalSaveDeliveries = function (deliveries) {
            var uploadInfo = {
                week: $scope.week,
                replace: $scope.replace,
                result: deliveries,
                routesWeek: $scope.routesWeek,
                uploadOption: $scope.uploadOption,
                clientId: $scope.selectedClient._id
            };

            $http.post('/api/uploadDeliveries', uploadInfo)
                .then(
                    function (response) {
                        console.log(response);
                        $window.location.href = '/admindeliveriesSubmit';
                    },
                    function (err) {
                        console.log(err);
                    }
                );
        }

        //finally submit all the deliveries
        $scope.finalSubmit = function () {
            _.forEach($scope.wrongDeliveries, function (delivery) {
                if (delivery.correctAddress) {
                    delivery.deliveryaddress = delivery.correctAddress;
                }
            });
            $scope.finalSaveDeliveries($scope.wrongDeliveries);
        }
        //Function to show address correction page.
        function showAddressCorrection() {
            $scope.fieldsView = false;
            $scope.addressCorrection = true;
            $window.scrollTo(0, 0);

        }

        //function to check mapping
        function checkMapping(delivery,callback) {
            var mappingError = '';
            if(delivery) {
                if(!(delivery.hasOwnProperty('deliveryid'))){
                    mappingError = {
                        mapError : 1,
                        error:'Delivery Id is mandatory.'
                    }
                }
                if(!(delivery.hasOwnProperty('pickupaddress'))){
                    mappingError = {
                        mapError : 1,
                        error:'Pickup address is mandatory.'
                    }
                }
                if(!(delivery.hasOwnProperty('deliveryaddress'))){
                    mappingError = {
                        mapError : 1,
                        error:'Delivery address is mandatory.'
                    }
                }
                if(!(delivery.hasOwnProperty('deliverydayofweek'))){
                    mappingError = {
                        mapError : 1,
                        error:'Delivery day of week is mandatory.'
                    }
                }
            }
            callback(mappingError,null);
        }

        //Function to show address correction page.
        function validateDeliveriesData(validResult,callback) {
            var error = '';
            for (var i = 0; i < validResult.length; i++) {
                if (validResult[i].deliveryid == "" || validResult[i].deliveryid == null || validResult[i].deliveryid == undefined) {
                    error = {
                        error_code: 0,
                        fileError: "Delivery Id is mandatory(row"  + (i + 1) + ")"
                    };
                    break;
                }
                if (validResult[i].deliveryaddress == "" || validResult[i].deliveryaddress == null || validResult[i].deliveryaddress == undefined) {
                    error = {
                        error_code: 3,
                        fileError: "Delivery Address is mandatory(row" + (i + 1) + ")"
                    };
                    break;
                }
                if (validResult[i].deliverydayofweek == "" || validResult[i].deliverydayofweek == null || validResult[i].deliverydayofweek == undefined) {
                    error = {
                        error_code: 4,
                        fileError: "Delivery day of week is mandatory(row" + (i + 1) + ")"
                    };
                    break;
                }
            }

            if(error != '') {
                callback(error,null)
            } else {
                callback(null,null)
            }
        }
    }]);


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
            var newAutocomplete = function () {
                scope.gPlace = new google.maps.places.Autocomplete(element[0], opts);
                google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
                    scope.$apply(function () {
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
                        scope.ngAutocomplete = element.val();
                    });
                });
            };
            newAutocomplete();
            //watch options provided to directive
            scope.watchOptions = function () {
                return scope.options;
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

