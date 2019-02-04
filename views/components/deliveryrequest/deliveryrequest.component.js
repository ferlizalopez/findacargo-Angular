var module = angular.module("app");
module.component("deliveryrequest", {
    templateUrl: "../components/deliveryrequest/deliveryrequest.component.html",
    controllerAs: "model",
    controller: ["$http", "$state", "$scope", "toastr", "urlService", "$timeout", "$translate", controller]
});

function controller($http, $state, $scope, toastr, urlService, $timeout, $translate) {

    $scope.pickup_location_address_patterns = [];
    $scope.custom_pickup_location_address = '';
    $scope.pickup_location_address = '';
    $scope.addMoreDelivery = false;
    $scope.minDate = new Date().toDateString();
    $scope.deliveryForm = {
        deliveryType:''
    };
    $scope.addMore = function(){
        $scope.addMoreDelivery = true;
    };
    this.pickup_components_showed = false;
    this.userInfo = null;
    this.full_insurance = false;
    this.full_insurance_value = 0;
    let defaultDepartmensCookie = getCookie('departmentData');
    $scope.currentDepartment = {}
    $scope.departments = []
    $scope.editMode = true
    $scope.editCarTypeMode = true
    $scope.editDistributionTypeMode = true
    var deliveryTypes = []

    $http.get('/delivery_settings/')
    .then(response => {
        if (!response.data.body) {
            return;
        }
        var setting = response.data.body
        var depts = []
        if(defaultDepartmensCookie){
            //console.log(JSON.parse(getCookie('departmentData')).departments);
            depts = JSON.parse(defaultDepartmensCookie).departments;
        }

        if (!setting.allow_express) {
            depts = depts.filter(o=>{
                return o.typeOfDelivery != 'Express / On-demand'
            })
        } 

        if (depts.length > 0) {
            $scope.departments = depts;
            $scope.currentDepartment = depts.filter(function (obj) {
                if (obj.default) {
                    return obj;
                }
            })[0]
            //$scope.defaultDepartment = $scope.currentDepartment.name;
        }

        $scope.departments.map((dept)=>{
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
    
        depts = $scope.departments.filter((dept)=>{
            return dept.typeOfDelivery == $scope.defaultDeliveryType
        })
    
        $scope.defaultDepartment = (depts.length > 0 ? depts[0].name : '')
    });
  
    custom_autocomplete_pickup = new google.maps.places.Autocomplete(document.getElementById('custom_pickup_location_address'));
    autocomplete_delivery = new google.maps.places.Autocomplete(document.getElementById('delivery_location_address'));

        // {"value": "", "name": "Select a delivery type"},
        // {"value": "Express / On-demand", "name": "Express / On-demand"},
        // {"value": "Distribution", "name": "Distribution"},
        // {"value": "Dedicated Drivers", "name": "Dedicated Drivers"},

    $scope.countryOptions = [
        {"value": "45", "name": "(+45)"},
        {"value": "46", "name": "(+46)"},
    ];

    $scope.carTypes = [
        {"value": "Small van", "name": "Small van"},
        {"value": "Van (3 pallets)", "name": "Van (3 pallets)"},
        {"value": "BoxVan with lift (6 pallets)", "name": "BoxVan with lift (6 pallets)"},
        {"value": "Box Van with lift (8 pallets)", "name": "Box Van with lift (8 pallets)"}
    ]

    $scope.deliveryCountry = '45' //default

    $http.get('/getServices')
    .then(response => {
        //console.log('response', response.data.body)
        var services = response.data.body
        $scope.distributions = services.map((service)=>{
            return {"value": service.name, "name": service.name}
        })
    });

    $http.get('/getNewKey')
    .then(response => {
        var ret = response.data
        if(ret.success) {
            $scope.delivery_id = String(ret.data.id)
        }
        // var services = response.data.body
        // $scope.distributions = services.map((service)=>{
        //     return {"value": service.name, "name": service.name}
        // })
    });

    this.setPickupAddress = (address_components) => {
        console.log('address_components', address_components)

        var city, state, zip, route, street_number, sublocality_level_1, country;

        address_components.forEach(function (component) {
            var types = component.types;
            if (types.indexOf('route') > -1) {
                route = component.long_name || '';
            }
            if (types.indexOf('street_number') > -1) {
                street_number = component.long_name;
            }
            if (types.indexOf('postal_code') > -1) {
                zip = component.long_name;
            }
            if (types.indexOf('locality') > -1) {
                city = component.long_name;
            }
            if (types.indexOf('sublocality_level_1') > -1) {
                sublocality_level_1 = component.long_name;
            }
            // else {
            //     sublocality_level_1 = city;
            // }
            if (types.indexOf('country') > -1) {
                country = component.long_name;
            }
        });

        var street = route || '';
        var streetNum = street_number || '';

        $scope.pickup_location_address_1 = street + " " + streetNum;
        $scope.pickup_location_city = sublocality_level_1 || city;
        $scope.pickup_location_zip = (zip || '').replace(/\s/g, "")
        $scope.pickup_location_country = country || '';
        $timeout(() => { $scope.$apply()});
    };

    this.setDeliveryAddress = (address_components) => {
        var city, state, zip, route, street_number, sublocality_level_1, country;

        address_components.forEach(function (component) {
            var types = component.types;
            if (types.indexOf('route') > -1) {
                route = component.long_name || '';
            }
            if (types.indexOf('street_number') > -1) {
                street_number = component.long_name;
            }
            if (types.indexOf('postal_code') > -1) {
                zip = component.long_name;
            }
            if (types.indexOf('locality') > -1) {
                city = component.long_name;
            }
            if (types.indexOf('sublocality_level_1') > -1) {
                sublocality_level_1 = component.long_name;
            }
            else {
                sublocality_level_1 = city;
            }
            if (types.indexOf('country') > -1) {
                country = component.long_name;
            }
        });
        var street = route || '';
        var streetNum = street_number || '';

        $scope.delivery_location_address_1 = street + " " + streetNum;
        $scope.delivery_location_city = sublocality_level_1 || '';
        $scope.delivery_location_zip = zip || '';
        $scope.delivery_location_country = country || '';
        $timeout(() => { $scope.$apply()});
    };

    var that = this;
    google.maps.event.addListener(custom_autocomplete_pickup, 'place_changed', function () {
        var place = custom_autocomplete_pickup.getPlace();
        if (!place) return;
        var address = place.address_components;
        $timeout(() => { $scope.$apply()});
        that.setPickupAddress(address);
    });

    google.maps.event.addListener(autocomplete_delivery, 'place_changed', function () {
        var place = autocomplete_delivery.getPlace();
        if (!place) return;
        var address = place.address_components;
        $timeout(() => { $scope.$apply()});
        that.setDeliveryAddress(address);
    });

    this.pickupSelect = function(address) {
        if (address === 'Other') {
            this.setPickupAddress([]);
            return;
        }

        $http.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(address) + "&key=AIzaSyADQx4-dsxmzj6jP1pH__Wb6xl9nYdO2Es")
            .then((result) => {
                if (result.data.results.length > 0) {
                        this.setPickupAddress(result.data.results[0].address_components);
                    }
            });
    };

    $scope.today = function () {
        dt = new Date();
        date = dt.toLocaleString("en-us", {month: "long"}) + " " + dt.getDate() + ", " + dt.getFullYear();
        $scope.delivery_date = date;
    };
    $scope.today();

    this.getUser = () => {
        $http.get('/account-info/')
            .then(response => {
                if (response.data.body.account) {
                    this.userInfo = response.data.body.account;
                }
            });
    };

    this.getDefaultDeliverySettings = () => {
        $http.get('/delivery_settings/')
            .then(response => {
                if (!response.data.body) {
                    this.setDefaults();
                    return;
                }
                if (response.data.body.addresses && response.data.body.addresses.length > 0) {
                    $scope.pickup_location_address_patterns = response.data.body.addresses;
                    $scope.pickup_location_address_patterns.push({default: false, value: 'Other'});

                    $scope.pickup_location_address = $scope.pickup_location_address_patterns.find(el => {return el.default}).value;
                    if (!$scope.pickup_location_address) {
                        $scope.pickup_location_address = $scope.pickup_location_address_patterns[0].value;
                    }

                    this.pickupSelect($scope.pickup_location_address);
                } else {
                    $scope.pickup_location_address_patterns.push({default: true, value: 'Other'});
                    $scope.pickup_location_address = $scope.pickup_location_address_patterns[0].value;
                    this.pickup_components_showed = true;
                }
                $scope.deliveryForm.pickup_deadline = response.data.body.pickup_deadline ? response.data.body.pickup_deadline : "";
                $scope.deliveryForm.pickup_deadline_to = response.data.body.pickup_deadline_to ? response.data.body.pickup_deadline_to : "";
                $scope.delivery_notes = response.data.body.default_note ? response.data.body.default_note : "";
                //$scope.deliveryForm.delivery_window_start = response.data.body.delivery_window_start ? response.data.body.delivery_window_start : "08:00";
                //$scope.deliveryForm.delivery_window_end = response.data.body.delivery_window_end ? response.data.body.delivery_window_end : "16:00";
            });

    };

    this.setDefaults = () => {
        $scope.deliveryForm.pickup_deadline = "08:00";
        $scope.deliveryForm.pickup_deadline_to = "16:00";
        $scope.deliveryForm.delivery_window_start = '08:00';
        $scope.deliveryForm.delivery_window_end = '16:00';
        $scope.pickup_location_address_patterns.push({default: true, value: 'Other'});
        $scope.pickup_location_address = $scope.pickup_location_address_patterns[0].value;
    };

    this.getDefaultDeliverySettings();
    this.getUser();

    this.sendRequest = (d, isValid) => {
        //console.log('isValid', isValid)
        if (isValid) {

            var date = new Date(d.delivery_date.$modelValue);
            date.setDate(date.getDate() + 1);
            var authToken = JSON.parse(localStorage.getItem('apikey'));
            var headers = {'Token': authToken};
            var reqJSON = {
                "delivery_id": d.delivery_id.$modelValue,
                "cargo_insurance": {
                    "enabled": this.full_insurance,
                    "value": this.full_insurance ? this.full_insurance_value : 0
                },
                "department": $scope.defaultDepartment,
                "recipient_id": (d.recipient_id ? (d.recipient_id.$modelValue || '') : ''),
                "recipient_name": d.recipient_name.$modelValue,
                "recipient_email": (d.recipient_email ? (d.recipient_email.$modelValue || '') : ''),
                "delivery_date": date.toISOString(),
                "recipient_phone": {
                    "country_iso_code": $scope.deliveryCountry=="45"?"DK":"SE",
                    "country_dial_code": $scope.deliveryCountry,
                    "phone": d.recipient_phone_number.$modelValue

                },
                "pickup_window": {
                    "from": (d.pickup_deadline ? (d.pickup_deadline || '08:00') : ''),
                    "to": (d.pickup_deadline_to ? (d.pickup_deadline_to || '16:00') : '')
                },
                "delivery_location": {
                    "description": "",
                    "zip": $scope.delivery_location_zip,
                    "city": $scope.delivery_location_city,
                    "address_1": $scope.delivery_location_address_1,
                    "address_2": d.delivery_location_address_2.$modelValue || ""
                },
                "delivery_window": {
                    "from": (d.delivery_window_start ? (d.delivery_window_start || '08:00') : '08:00'),
                    "to": (d.delivery_window_end ? (d.delivery_window_end || '16:00') : '16:00')
                },
                "delivery_label": (d.delivery_label ? (d.delivery_label.$modelValue || '') : ''),
                "delivery_notes": (d.delivery_notes ? (d.delivery_notes.$modelValue || '') : ''),
                "delivery_number_of_packages": (d.delivery_number_of_packages ? (d.delivery_number_of_packages || '1') : '1'),
                "pickup_location": {
                    "description": "",
                    "zip": $scope.pickup_location_zip,
                    "city": $scope.pickup_location_city,
                    "address_1": $scope.pickup_location_address_1,
                    "address_2": d.pickup_location_address_2 ? (d.pickup_location_address_2.$modelValue || "") : ""
                }
            };

            reqJSON.delivery_type = d.deliveryType
            if(d.deliveryType == 'Express / On-demand') {
                //express delivery
                reqJSON.cartype = d.deliveryCarType
            } else if(d.deliveryType == 'Distribution'){
                reqJSON.distribution = d.deliveryDistribution
            }

            //console.log('reqJSON', reqJSON)
            
            $http({
                method: 'POST',
                url: urlService.getApiUrl() + '/v1.3/scheduled/create',
                data: [reqJSON],
                headers: headers
            }).then((response) => {
                if (response.status === 201) {
                    d = null;
                    toastr.success($translate.instant('delivery_request.delivery_created'));
                    if($scope.addMoreDelivery){
                        window.location.reload();
                    } else {
                        //window.location.href = '/#!/deliverydetails/' + response.data.scheduled_id;
                        window.history.back();
                    }
                }
            }, function (error) {
                console.log('error -', error);
                if (error.data.error)
                toastr.error($translate.instant(error.data.message));
                    //alert(error.data.error.message);
            });
        }
    }

    this.showPickupComponents = () => {
        this.pickup_components_showed = true;
    }

    this.changeDepartment = (e) =>{
        $scope.currentDepartment = $scope.departments.filter(function (obj) {
            if (obj.name == $scope.defaultDepartment) {
                return obj;
            }
        })[0]
        //console.log("changeDepartment", $scope.currentDepartment)
    }

    this.precheck = (form) =>{
        if(form.deliveryType == '') return false
        if(form.deliveryType == 'Express / On-demand' && !form.deliveryCarType) return false
        if(form.deliveryType == 'Distribution' && !form.deliveryDistribution) return false

        return true
    }

    this.precheckExpress = (form) =>{
        if(form.deliveryType == 'Express / On-demand' && form.deliveryCarType) return true

        return false
    }

    this.getExpressCost = (form) => {
        if(form.deliveryCarType == 'Small van' || form.deliveryCarType == 'Van (3 pallets)') {
            return '320 dkk + moms per hour'
        } else {
            return '390 dkk + moms per hour'
        }
    }

    this.changeType = (form) => {
        //console.log('form.deliveryType', form.deliveryType)
        if(form.deliveryType == 'Distribution') {
            form.delivery_window_start = '08:00'
            form.delivery_window_end = '16:00'
            if(!form.deliveryDistribution) {
                form.deliveryDistribution = $scope.distributions[0].value
            }
        } else if(form.deliveryType == 'Express / On-demand') {
            form.delivery_window_start = ''
            form.delivery_window_end = ''
        } else {
            form.delivery_window_start = ''
            form.delivery_window_end = ''
        }

        var depts = $scope.departments.filter((dept)=>{
            return dept.typeOfDelivery == form.deliveryType
        })
        $scope.defaultDepartment = (depts.length > 0 ? depts[0].name : '')
        //$scope.editMode = false
    }

    this.initForm = () => {
        setTimeout(()=>{
            $scope.deliveryForm.deliveryType = $scope.defaultDeliveryType
            //console.log($scope.deliveryForm)
            this.changeType($scope.deliveryForm)
        }, 100)
    }

    this.toggleEdit = () => {
        //$scope.editMode = !$scope.editMode
        //$scope.editCarTypeMode = true
        //$scope.editDistributionTypeMode = true
    }

    this.toggleCarTypeEdit = () => {
        //$scope.editCarTypeMode = !$scope.editCarTypeMode
    }

    this.toggleDistributionTypeEdit = () => {
        //$scope.editDistributionTypeMode = !$scope.editDistributionTypeMode
    }

    this.initForm()
}
