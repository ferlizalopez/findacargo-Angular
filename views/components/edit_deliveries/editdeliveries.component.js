var module = angular.module("app");
module.component("editdeliveries", {
    templateUrl: "../components/edit_deliveries/editdeliveries.component.html",
    controllerAs: "model",
    controller: ["$http", "$state", "$scope", "toastr", "$stateParams", "$translate", "$timeout", controller]
});

function controller($http, $state, $scope, toastr, $stateParams, $translate, $timeout) {

    $scope.pickup_location_address_patterns = [];
    $scope.custom_pickup_location_address = '';
    $scope.pickup_location_address = '';

    this.pickup_components_showed = false;
    $scope.deliveryForm = null;
    this.userInfo = null;
    $scope.currentDepartment = {}
    let defaultDepartmensCookie = getCookie('departmentData');
    if (defaultDepartmensCookie) {
        let deps = JSON.parse(defaultDepartmensCookie).departments;
        $scope.departments = deps
        
        if (deps.length > 0) {
            $scope.currentDepartment = deps.filter(function (obj) {
                if (obj.default) {
                    return obj;
                }
            })[0]
            $scope.assignedDepartment = $scope.currentDepartment.name;
        }
    }

    Date.prototype.getWeek = function() {
        var onejan = new Date(this.getFullYear(), 0, 1);
        return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    }

    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    $scope.deliveryTypes = [
        {"value": "", "name": "Select a delivery type"},
        {"value": "Express / On-demand", "name": "Express / On-demand"},
        {"value": "Distribution", "name": "Distribution"},
        {"value": "Dedicated Drivers", "name": "Dedicated Drivers"},
    ]

    $scope.carTypes = [
        {"value": "Small van", "name": "Small van"},
        {"value": "Van (3 pallets)", "name": "Van (3 pallets)"},
        {"value": "BoxVan with lift (6 pallets)", "name": "BoxVan with lift (6 pallets)"},
        {"value": "Box Van with lift (8 pallets)", "name": "Box Van with lift (8 pallets)"}
    ]    

    // $scope.distributions = [
    //     {"value": "Under 40 kg", "name": "Under 40 kg"},
    //     {"value": "1 pallet", "name": "1 pallet"},
    //     {"value": "1/2 EU pallet", "name": "1/2 EU pallet"},
    //     {"value": "1/4 EU pallet", "name": "1/4 EU pallet"}
    // ]

    custom_autocomplete_pickup = new google.maps.places.Autocomplete(document.getElementById('custom_pickup_location_address'));
    autocomplete_delivery = new google.maps.places.Autocomplete(document.getElementById('delivery_location_address'));

    this.setPickupAddress = (address_components) => {
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

        $scope.pickup_location_address_1 = street + " " + streetNum;
        $scope.pickup_location_city = sublocality_level_1 || '';
        $scope.pickup_location_zip = zip || '';
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
    google.maps.event.addListener(custom_autocomplete_pickup, 'place_changed',  () => {
        var place = custom_autocomplete_pickup.getPlace();
        if (!place) return;
        var address = place.address_components;
        $timeout(() => { $scope.$apply()});
        that.setPickupAddress(address);
    });

    google.maps.event.addListener(autocomplete_delivery, 'place_changed',  () => {
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
    
            $http.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(address) + "&key=AIzaSyDjW55JGRtxQ8b4_btzyT3zuE_YLZztLYU")
                .then((result) => {
                    if (result.data.results.length > 0) {
                            this.setPickupAddress(result.data.results[0].address_components);
                        }
                });
        };

    this.deliverydetails = () => {
        var deliveryid = $stateParams.id;

        var authToken = JSON.parse(localStorage.getItem('apikey'));
        var headers = { 'Token': authToken };

        this.minDate = new Date().toString();

        $http.get('/getServices')
        .then(response => {
            //console.log('response', response.data.body)
            var services = response.data.body
            $scope.distributions = services.map((service)=>{
                return {"value": service.name, "name": service.name}
            })

            $http.get('/deliverydetails/' + deliveryid)
            .then(response => {
                console.log(response.data.body)
                if (response.status == 200) {

                    var d = response.data.body.delivery;

                    $scope.delivery_location_address_1 = d.deliveryaddress;
                    $scope.delivery_location_city = d.deliverycity;
                    $scope.delivery_id = d.deliveryid;
                    $scope.assignedDepartment = d.department;
                    $scope.currentDepartment = $scope.departments.filter(function (obj) {
                        return obj.name == $scope.assignedDepartment
                    })[0]
                    $scope.assignedDepartment = $scope.currentDepartment.name;
                    $scope.delivery_label = d.deliverylabel || "";
                    $scope.delivery_notes = d.deliverynotes || "";
                    $scope.deliveryForm.delivery_number_of_packages = d.deliverynumberofpackages || '1';
                    $scope.deliveryForm.delivery_window_start = d.deliverywindowstart;
                    $scope.deliveryForm.delivery_window_end = d.deliverywindowend;
                    $scope.delivery_location_zip = d.deliveryzip;
                    $scope.delivery_location_address = d.deliveryaddress + ", " + d.deliveryzip + " " + d.deliverycity + ", Denmark";
                    $scope.delivery_location_country = "Denmark";
                    $scope.delivery_location_address_2 = d.deliveryaddress2 || "";
                    $scope.driver_email = d.driveremail;
                    $scope.pickup_location_address_1 = d.pickupaddress;
                    //$scope.pickup_location_address = d.pickupaddress + ", " + d.pickupzip + " " + d.pickupcity + ", Denmark";
                    $scope.pickup_location_address_2 = d.pickupaddress2 || "";
                    $scope.pickup_location_country = "Denmark";
                    $scope.pickup_location_city = d.pickupcity;
                    $scope.deliveryForm.pickup_deadline = d.pickupdeadline;
                    $scope.deliveryForm.pickup_deadline_to = d.pickupdeadlineto;
                    $scope.pickup_location_zip = d.pickupzip;
                    $scope.recipient_email = d.recipientemail;
                    $scope.recipient_id = d.recipientid;
                    $scope.recipient_name = d.recipientname;
                    $scope.full_insurance = typeof d.full_insurance !== "undefined" ? d.full_insurance : false;
                    $scope.full_insurance_value = d.full_insurance_value || 0;
                    $scope.recipient_phone_number = d.recipientphone.phone;
                    var dt = new Date(d.deliverydate);

                    //$scope.delivery_date = dt.toLocaleString("en-us", { month: "long" }) + " " + dt.getUTCDate() + ", " + dt.getUTCFullYear();
                    $scope.delivery_date = dt.toLocaleString("en-us", { month: "long" }) + " " + dt.getUTCDate() + ", " + dt.getFullYear();
                    $scope.week_number = d.weekNumber;
                    $scope.delivery_day_of_week = d.deliverydayofweek;
                    $scope.deliveryForm.status = d.status;
                    $scope.deliveryForm.deliveryCarType = d.cartype;
                    $scope.deliveryForm.deliveryDistribution = d.distribution;
                    $scope.deliveryStatusOptions = [
                        {"value": 1, "name": $translate.instant('common.created')},
                        {"value": 2, "name": $translate.instant('common.in_progress')},
                        {"value": 3, "name": $translate.instant('common.finished')}
                    ];
                    $scope.deliveryCountryOptions = [
                        {"value": "45", "name": "(+45) "},
                        {"value": "46", "name": "(+46) "},
                    ];
                    $scope.deliveryStatus = $scope.deliveryStatusOptions.filter(function( obj ) {
                        return obj.value == d.status;
                    })[0].value;

                    var deliveryCountryObj = _.find($scope.deliveryCountryOptions, ( obj ) => {
                        return obj.value == d.recipientphone.country_dial_code;
                    })

                    $scope.deliveryCountry = '45' //default
                    if(deliveryCountryObj) {
                        $scope.deliveryCountry = deliveryCountryObj.value
                    }

                    console.log('$scope.deliveryCountry',$scope.deliveryCountry)
                } else {
                    console.log("Got error response");
                }

                var fullPickupAddress = d.pickupaddress + ", " + d.pickupzip + " " + d.pickupcity;
                $http.get('/delivery_settings/')
                .then(response => {
                    if (response.data.body.addresses && response.data.body.addresses.length > 0) {
                        $scope.pickup_location_address_patterns = response.data.body.addresses;
                        $scope.pickup_location_address_patterns.push({default: false, value: 'Other'});
                        
                        let buf = $scope.pickup_location_address_patterns.find(el => {return el.value.indexOf(d.pickupzip) !== -1 && el.value.indexOf(d.pickupcity) !== -1});
                        if (!buf) {
                            $scope.pickup_location_address = 'Other';
                            $scope.custom_pickup_location_address = fullPickupAddress;
                        } else {
                            $scope.pickup_location_address = buf.value;
                        }
                        //this.pickupSelect($scope.pickup_location_address);
                    } else {
                        $scope.pickup_location_address_patterns.push({default: true, value: 'Other'});
                        $scope.pickup_location_address = $scope.pickup_location_address_patterns[0].value;
                        $scope.custom_pickup_location_address = fullPickupAddress;
                        this.pickup_components_showed = true;
                    }
                });
            })
        });
    }
    this.deliverydetails();
    this.getUser = () => {
        $http.get('/account-info/')
            .then(response => {
                if (response.data.body.account) {
                    this.userInfo = response.data.body.account;
                }
            });
    };
    this.getUser();
    // Returns ISO 8601 week number and year
    Date.prototype.getISOWeek = function () {
        var jan1, week, date = new Date(this);
        date.setDate(date.getDate() + 4 - (date.getDay() || 7));
        jan1 = new Date(date.getFullYear(), 0, 1);
        week = Math.ceil((((date - jan1) / 86400000) + 1) / 7);
        return week;
    };

    this.UpdateRequest = (del, isValid) => {
        if (isValid) {
            var localDate = new Date(del.delivery_date.$modelValue)
            var utcDate = new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate()))
            //console.log("del.delivery_date.$modelValue", utcDate, del.delivery_date.$modelValue, new Date(del.delivery_date.$modelValue), $scope.delivery_date)
            var week = utcDate.getISOWeek();
            var day = utcDate.getDay();
            var authToken = JSON.parse(localStorage.getItem('apikey'));
            var headers = { 'Token': authToken };
            
            var reqJSON = {
                "deliveryid": (del.delivery_id.$modelValue || ""),
                "department": $scope.assignedDepartment,
                "recipientname": del.recipient_name.$modelValue,
                "recipientemail": (del.recipient_email.$modelValue || ""),
                "recipientphone": {
                    "country_iso_code": $scope.deliveryCountry=="45"?"DK":"SE",
                    "country_dial_code": $scope.deliveryCountry,
                    "phone": del.recipient_phone_number.$modelValue
                },
                "full_insurance": del.full_insurance ? del.full_insurance.$modelValue : false,
                "full_insurance_value": del.full_insurance_value ? del.full_insurance_value.$modelValue : 0,
                "pickupaddress": $scope.pickup_location_address_1,
                "pickupaddress2": del.pickup_location_address_2.$modelValue || "",
                "pickupzip": $scope.pickup_location_zip,
                "pickupcity": $scope.pickup_location_city,
                "pickupdeadline": (del.pickup_deadline),
                "pickupdeadlineto": (del.pickup_deadline_to),
                "deliveryaddress": $scope.delivery_location_address_1,
                "deliveryaddress2": del.delivery_location_address_2.$modelValue || "",
                "deliveryzip": $scope.delivery_location_zip,
                "deliverycity": $scope.delivery_location_city,
                "deliverywindowstart": del.delivery_window_start,
                "deliverywindowend": del.delivery_window_end,
                "deliverynumberofpackages": del.delivery_number_of_packages,
                "driveremail": "",
                "deliverynotes": (del.delivery_notes.$modelValue || ""),
                "deliverylabel": (del.delivery_label.$modelValue || ""),
                "deliverydate": utcDate,
                "weekNumber": week,
                "deliverydayofweek": days[day],
                "status": $scope.deliveryStatus,
            }

            reqJSON.delivery_type = $scope.currentDepartment.typeOfDelivery
            if(reqJSON.delivery_type == 'Express / On-demand') {
                //express delivery
                reqJSON.cartype = del.deliveryCarType
            } else if(reqJSON.delivery_type == 'Distribution'){
                reqJSON.distribution = del.deliveryDistribution
            }

            console.log('reqJSON', reqJSON)

            $http.post('/update_delivery/' + $stateParams.id, reqJSON)
                .then(response => {
                    if (response.data.success === true) {
                        toastr.success('Delivery Details Updated Successfully.');
                        window.location.href = '/#!/deliverydetails/' + $stateParams.id;
                    }
                })
        }
    }

    this.showPickupComponents = () => {
        this.pickup_components_showed = true;
    }

    this.changeDepartment = (e) =>{
        $scope.currentDepartment = $scope.departments.filter(function (obj) {
            if (obj.name == $scope.assignedDepartment) {
                return obj;
            }
        })[0]
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
}