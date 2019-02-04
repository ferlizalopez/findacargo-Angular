var module = angular.module("app");
module.component("uploaddeliveries", {
    templateUrl: "../components/upload_deliveries/uploaddeliveries.component.html",
    controllerAs: "model",
    controller: ["$http", "$state", "$stateParams", "Upload", "$scope", "$q", "toastr", "$translate", "$window", "urlService", controller]
});

function controller($http, $state, $stateParams, Upload, $scope, $q, toastr, $translate, $window, urlService) {

    this.API_ENDPOINT_URL = urlService.getApiUrl();

    /*Get default department name -start*/
    let defaultDepartmensCookie = getCookie('departmentData');
    $scope.currentDepartment = {}
    $scope.departments = []

    var deliveryTypes = []
    if (defaultDepartmensCookie) {
        let deps = JSON.parse(defaultDepartmensCookie).departments;
        if (deps.length > 0) {
            $scope.departments = deps;
            $scope.currentDepartment = deps.filter(function (obj) {
                if (obj.default) {
                    return obj;
                }
            })[0]
        }
    }

    $scope.departments&&$scope.departments.map((dept)=>{
        if(deliveryTypes.indexOf(dept.typeOfDelivery) == -1)
            deliveryTypes.push(dept.typeOfDelivery)
    })

    $scope.deliveryTypes = []
    var availableDeliveryTypes = ['Express / On-demand', 'Distribution', 'Dedicated Drivers']
    availableDeliveryTypes.filter((type)=>{
        if(deliveryTypes.indexOf(type) != -1)
            $scope.deliveryTypes.push({"value": type, "name": type})
    })

    $scope.defaultDeliveryType = $scope.deliveryTypes.length > 0 ? $scope.deliveryTypes[0].name : ''

    var depts = $scope.departments.filter((dept)=>{
        return dept.typeOfDelivery == $scope.defaultDeliveryType
    })

    $scope.defaultDepartment = (depts.length > 0 ? depts[0].name : '')
    /*Get default department name - end*/

    [
        {
      
          "delivery_date": "2018-08-29T18:30:00.000Z",
          "recipient_phone": {
            "country_iso_code": "DK",
            "country_dial_code": "45",
            "phone": "09898912233"
          },
         
          "delivery_location": {
            "description": "",
            "zip": "2650",
            "city": "Hvidovre",
            "address_1": "Hvidovregade 35C",
            "address_2": ""
          },
           "delivery_window": {
            "from": "46:20",
            "to": "56:25"
          },
          "delivery_number_of_packages": "1",
          "pickup_location": {
            "description": "",
            "zip": "5220",
            "city": "Odense",
            "address_1": "Campusvej 55",
            "address_2": ""
          }
        }
      ]
      
    $scope.mappingArray = [
        { value: 'delivery_id', description: 'Delivery ID' },
        { value: 'department_name', description: 'Department Name' },
        { value: 'recipient_id', description: 'Recipient ID' },
        { value: 'recipient_name', description: 'Recipient Name' },
        { value: 'recipient_email', description: 'Recipient Email' },
       // { value: 'delivery_date', description: 'Delivery Date' },
        { value: 'recipient_phone', description: 'Recipient Phone' },
        { value: 'pickup_location_address', description: 'Pickup Street Address' },
        { value: 'pickup_zip', description: 'Pickup Zip' },
        { value: 'pickup_city', description: 'Pickup City' },
        { value: 'pickup_window_start', description: 'Pickup window start' },
        { value: 'pickup_window_end', description: 'Pickup window end' },
        { value: 'delivery_location_address', description: 'Delivery Address 1' },
        { value: 'delivery_address_2', description: 'Delivery Address 2' },
        { value: 'delivery_zip', description: 'Delivery Zip' },
        { value: 'delivery_city', description: 'Delivery City' },
        { value: 'delivery_date', description: 'Delivery Date' },
       // { value: 'deliverydayofweek', description: 'Delivery Day of week' },
        { value: 'delivery_window_start', description: 'Delivery window start' },
        { value: 'delivery_window_end', description: 'Delivery window end' },
        { value: 'delivery_label', description: 'Delivery Label' },
        { value: 'delivery_number_of_packages', description: 'Number of packages' },
        { value: 'delivery_notes', description: 'Delivery Notes' },
        { value: 'routes', description: 'Routes' },
        { value: 'driver_email', description: 'Driver Email' }
    ];

    // $scope.optionalFields = [
    //     'Delivery ID', 'Pickup Zip', 'Delivery City', 'Number of Packages',
    //     'Recipient-Client ID', 'Pickup City', 'Delivery Start', 'Delivery Notes',
    //     'Recipient Name', 'Pickup Deadline', 'Delivery End', 'Driver Email',
    //     'Recipient Phone', 'Delivery Zip', 'Delivery Label'
    // ]

    $scope.optionalFields = [
        'upload_optional_fields.delivery_id', 'upload_optional_fields.pickup_zip', 'upload_optional_fields.delivery_city', 'upload_optional_fields.number_of_pages',
        'upload_optional_fields.recipient_client_id', 'upload_optional_fields.pickup_city', 'upload_optional_fields.delivery_start', 'upload_optional_fields.delivery_note',
        'upload_optional_fields.recipient_name', 'upload_optional_fields.pickup_window_start', 'upload_optional_fields.pickup_window_end', 'upload_optional_fields.pickup_end', 'upload_optional_fields.driver_email',
        'upload_optional_fields.recipient_phone', 'upload_optional_fields.delivery_zip', 'upload_optional_fields.delivery_label'
    ]

    $scope.allFieldArr = [
      //  'recipient_id',
      //  'recipient_name',
      //  'recipient_email',
        'delivery_date',
        'recipient_phone',
     //   'pickup_location_address',
     //   'pickup_zip',
      //  'pickup_city',
        //'pickup_deadline',
        'delivery_location_address',
     //   'delivery_zip',
     //   'delivery_city',
    //    'deliverydayofweek',
   //     'delivery_window_start',
   //     'delivery_window_end',
        //'delivery_label',
     //   'delivery_number_of_packages',
        //'delivery_notes',
      //  'driver_email'
    ];
   

    $scope.missingFields = $scope.allFieldArr;
    $scope.validationMapArr = [];
    $scope.validationMapArr['delivery_date'] = 'Delivery Date';
    $scope.validationMapArr['recipient_phone'] = 'Recipient Phone';
    $scope.validationMapArr['delivery_location_address'] = 'Delivery Address 1';
    $scope.validationMapArr['delivery_zip'] = 'Delivery Zip';
    $scope.validationMapArr['delivery_city'] = 'Delivery City';


    // Booleans to show different sections in upload
    $scope.showUploader = true;
    $scope.showProgress = false;
    $scope.showMatchDropdowns = false;
    $scope.showWrongAddresses = false;
    $scope.showSuccess = false;
    $scope.selectAllMappingField = false;

    // Submit function to upload file
    this.submit = function() {
        if (this.file) {
            this.upload(this.file);
        }
    };
    $scope.invalidAddressArray = [];
    $scope.isServer = false;
    $scope.serverErrorMsg = '';
    $scope.deliverySettings = false;

    $http.get("/checkDeliveriesDefaultSettings")
                .then((result) => {
                    if (result.data.status === false) {
                        $scope.deliverySettings = result.data.error;
                    } else {
                        $scope.deliverySettings = false;
                    }
    });

    // Upload file
    this.upload = function(file) {
        if ($scope.deliverySettings) {
            return false;
        }
        $scope.showProgress = true;
        $scope.showUploader = false;
        Upload.upload({
            url: '/uploadDeliveriesFromClient',
            data: { file: file, type: $state.$current.name } // 'uploadAndPlanDeliveries'  or 'uploadPreplannedDeliveries'
        }).then(function(resp) {

            $scope.showUploader = false;
            $scope.showProgress = false;
            $scope.showMatchDropdowns = true;

            console.log('data', resp.data)
            $scope.deliveryKeys = resp.data[0];
            $scope.allDeliveries = resp.data;

        }, function(resp) {
            console.log('Error status: ' + resp.status);
        }, function(evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };

    // Remove all messages and errors when selecting a new file
    this.onFileSelect = function() {
        this.fileError = "";
        this.routeError = "";
        this.addressError = [];
        this.existError = "";
    };

    // Clear and reset upload button
    this.resetForm = function() {
        document.getElementById('upload_form').reset();
        this.replace = '';
        $('.chosen-select').val('').trigger('chosen:updated');

    };

    $scope.newHeaderArray = [];
    $scope.mappingError = [];

    this.createMapping = function(key, value, index) {
        /*
			Test cases:
			1. If dropdown already selected for someone else
			2. If changing the value of already selected dropdown
			3. Clear mapping errors before proceeding
        */
        //$scope.mappingError = [];
  
        if ($scope.newHeaderArray.indexOf(value) > -1) { // means dropdown already selected            
            $scope.mappingError.push({ value: value, index: index });
        } else {
            $scope.newHeaderArray[index] = value;
            $scope.mappingError.pop({ value: value, index: index });            
        }
       // $scope.mappingError.pop({ value: value, index: index });
       // $scope.newHeaderArray.push(value);	
    }

    this.next = function(newHeader) {
        var newArray = [];
        $scope.selectAllMappingField = true;
        for (var i = 0; i < $scope.newHeaderArray.length; i++) {
            var value = $scope.newHeaderArray[i];
            var index = $scope.missingFields.indexOf(value);
            if (index != -1) {
                $scope.missingFields.splice(index, 1);
            }
        }

        if ($scope.missingFields.length > 0) {
            $scope.selectAllMappingField = true;
            return false;
        } 
        $scope.selectAllMappingField = false;
        
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        for (var j = 0; j < $scope.allDeliveries.length; j++) {
            var newObj = {};
            
            // Now i got a single delivery data
            for (var i = 0; i < newHeader.length; i++) {
                var de = Object.keys($scope.allDeliveries[j])[i];
                if (typeof de !== 'undefined' && typeof newHeader[i] !=='undefined') {
                    if (newHeader[i] == 'delivery_location_address') {
                        var address = $scope.allDeliveries[j][Object.keys($scope.allDeliveries[j])[i]].trim();

                        var str_array = address.trim().split(',');
                        if (str_array.length >= 3) {
                            var address1 = str_array[0];
                            // if (str_array.length === 5) {
                            //     var CityPinArr = str_array[3].trim().split(' ');
                            //     var delivery_address_2 = str_array[1].trim() + '-' + str_array[2].trim();
                            // }
                            // else if (str_array.length === 4) {
                            //     var CityPinArr = str_array[2].trim().split(' ');
                            //     var delivery_address_2 = str_array[1].trim();
                            // } else {
                                var CityPinArr = str_array[str_array.length - 2].trim().split(' ');
                                if (str_array.length === 3) {
                                    var delivery_address_2 = '';
                                } else {
                                    var delivery_address_2 = str_array[1].trim();
                                }
                                
                            // }
                            
                            if (CityPinArr.length >= 2) {
                                var zip = CityPinArr[0];
                                var city = '';
                                for (let l= 1; l < CityPinArr.length ; l++) {
                                    if (l == 1) {
                                         city +=  CityPinArr[l];
                                    } else {
                                        city = city + ' ' + CityPinArr[l];
                                    }
                                }
                                city = city.trim();
                                newObj[newHeader[i]] = address1;
                                newObj['delivery_zip'] = zip;
                                newObj['delivery_city'] = city;
                                newObj['delivery_address_2'] = delivery_address_2;
                            } else {
                                $scope.invalidAddressArray.push({ row: j + 1, address: address });
                            }
                            continue;
                        } else if ((str_array.length > 3 || str_array.length < 3) && str_array.length != 1) {
                            if (!$scope.invalidAddressArray.includes(address)) {
                                $scope.invalidAddressArray.push({ row: j + 1, address: address });
                            }
                        }
                    }
                    if (newHeader[i] == 'delivery_date') {
                        var dateString = $scope.allDeliveries[j][Object.keys($scope.allDeliveries[j])[i]];
                        
                        var d = new Date(dateString);
                        //console.log('dateString', dateString,d, d.getDay())
                        var dayName = days[d.getDay()];
                        newObj['deliverydayofweek'] = dayName;
                    }
                    var tmpval = $scope.allDeliveries[j][Object.keys($scope.allDeliveries[j])[i]];
                    newObj[newHeader[i]] = tmpval;                    
                }
            }
           
            if ($scope.invalidAddressArray.length == 0 ) {
                if (typeof newObj['delivery_zip'] == 'undefined') {
                    $scope.selectAllMappingField = true;
                    $scope.missingFields.push('delivery_zip');
                    return false;
                }
    
                if (typeof newObj['delivery_city'] == 'undefined') {
                    console.log('city undefined', newObj)
                    $scope.selectAllMappingField = true;
                    $scope.missingFields.push('delivery_city');
                    return false;
                }
            }
            
            if (typeof newObj['department_name'] == 'undefined' || newObj['department_name']=='') {
                newObj['department_name'] = $scope.defaultDepartment;
            }


            newArray.push(newObj);
            
            if (j === $scope.allDeliveries.length - 1) {
                
                if ($scope.invalidAddressArray.length > 0) {
                    return false;
                }
                $http.post('/insertDeliveries', newArray)
	                .then(response=>{
                        if (typeof response.data.status !== 'undefined' &&  response.data.status === true) {
                            toastr.success($translate.instant('delivery_request.delivery_created'));
                            window.location.href = '/#!/upload/plan';
                        } else {
                            $scope.isServer = true;
                            $scope.serverErrorMsg = response.data.error;
                            toastr.error(response.data.error);
                        }
		            })
            }
        }
    }

    this.goBack = function () {
        $scope.selectAllMappingField = false;
        $scope.showUploader = true;
        $scope.showProgress = false;
        $scope.showMatchDropdowns = false;
        $scope.showWrongAddresses = false;
        $scope.showSuccess = false;
    };

    // function geoCodeCheck(deliveries) {

    //     var geocoder = new google.maps.Geocoder();
    //     $scope.wrongAddresses = [];

    //     var sequence = $q.defer();
    //     sequence.resolve();
    //     sequence = sequence.promise;

    //     angular.forEach(deliveries, function(delivery, index) {
    //         sequence = sequence.then(function() {
    //             geocoder.geocode({ address: delivery.deliveryaddress }, function(results, status) {
    //                 // check all the addresses 
    //                 if (status == google.maps.GeocoderStatus.OK) {

    //                     return val;
    //                 }
    //             });
    //         });
    //     });
    // }
}