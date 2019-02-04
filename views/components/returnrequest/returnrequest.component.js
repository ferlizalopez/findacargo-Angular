var module = angular.module("app");
module.component("returnrequest", {
    templateUrl: "../components/returnrequest/returnrequest.component.html",
    controllerAs: "model",
    controller: ["$http", "$state", "$stateParams", "$scope", "toastr", "urlService", "$timeout", "$translate", controller]
});

function controller($http, $state, $stateParams, $scope, toastr, urlService, $timeout, $translate) {

    this.returnDeliveryIdFlag = false;
    this.returned_delivery = $stateParams.returned_delivery;
    if (this.returned_delivery) {
        this.returnDeliveryIdFlag = true;
    }

    $scope.pickup_location_address_patterns = [];
    $scope.custom_pickup_location_address = '';
    $scope.pickup_location_address = '';
    $scope.addMoreDelivery = false;
    $scope.minDate = new Date().toDateString();
    $scope.deliveryForm = {};
    $scope.addMore = function(){
        $scope.addMoreDelivery = true;
    };
    this.pickup_components_showed = false;
    this.userInfo = null;
    this.full_insurance = false;
    this.full_insurance_value = 0;
    let defaultDepartmensCookie = getCookie('departmentData');
    $scope.currentDepartment = {}

    this.disableDeliverySelect = false;
    this.dateBlocks = {};
    this.timeBlocks = {};
    this.disabledActions = true;
    this.currentWeekNumber = 0;

    this.searchText = "";
    this.matchValue = [];

    var that = this;
    this.idx = 0;

    this.autoCompleteOptions = {
        minimumChars: 0,
        //autoHideDropdown: true,
        activateOnFocus: true,
        selectedTextAttr: 'realValue',
        selectedCssClass: 'colorCode',
        maxItemsToRender: 10,
        itemTemplateUrl: 'components/returnrequest/return-autocomplete-item.html',
        data: (searchText) => {
            this.returned_delivery = null;
            this.searchText = searchText;
            console.log("return item", this.getFinishedDeliveries(searchText))
            return this.getFinishedDeliveries(searchText);
        },
        itemSelected: (res) => {
            console.log("selecte res", res)
            $scope.deliveryForm.returned_delivery_id = res.item.realValue;
            this.returned_delivery = res.item;
            this.deliverydetails(res.item.id );
            $timeout(() => {
                $scope.$apply()
            });
        },
    };

    this.getMatchedProperty = (delivery) => {
        let exclude = ['_id', 'status', 'deliverydate', 'estimated_delivery_time'];
        let propertyLabelMapping = {
            deliveryid: $translate.instant('home.deliveryid'),
            recipientid:  $translate.instant('home.recipientid'),
            recipientname: $translate.instant('home.recipientname'),
            deliveryaddress: $translate.instant('home.deliveryaddress'),
            recipientphone: $translate.instant('home.recipientphone'),
            recipientemail: $translate.instant('home.recipientemail')
        };

        for (let property in propertyLabelMapping) {
            if (delivery.hasOwnProperty(property)) {
                if (delivery[property].toLowerCase().includes(this.searchText.toLowerCase())) {
                    return {
                        name: propertyLabelMapping[property],
                        value: delivery[property],
                        realValue: delivery.deliveryid,
                        id: delivery._id
                    }
                }
            }
        }
    };

    this.getFinishedDeliveries = (searchText) => {
        this.matchValue = [];
        this.idx = 0;
    
        return $http.get(`/get-finished-deliveries?query=${searchText}`)
        .then(response => response.data.body.map(x => {
            return this.getMatchedProperty(x);
            // return x.deliveryid;
        }));
    }

    if (defaultDepartmensCookie) {
        let deps = JSON.parse(defaultDepartmensCookie).departments;
        if (deps.length > 0) {
            $scope.departments = deps;
            $scope.currentDepartment = deps.filter(function (obj) {
                if (obj.default) {
                    return obj;
                }
            })[0]
            $scope.defaultDepartment = $scope.currentDepartment.name;
        }
    }


    $scope.deliveryTypes = [
        {"value": "", "name": "Select a delivery type"},
        {"value": "Express / On-demand", "name": "Express / On-demand"},
        {"value": "Distribution", "name": "Distribution"},
        {"value": "Dedicated Drivers", "name": "Dedicated Drivers"},
    ]

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

    $scope.distributions = [
        {"value": "Under 40 kg", "name": "Under 40 kg"},
        {"value": "1 pallet", "name": "1 pallet"},
        {"value": "1/2 EU pallet", "name": "1/2 EU pallet"},
        {"value": "1/4 EU pallet", "name": "1/4 EU pallet"}
    ]

    $scope.finishedDeliveries = [];

    $scope.deliveryCountry = '45' //default

    var that = this;

    this.$onInit = () => {
        this.setDateBlocks();
        this.setTimeBlocks();
        if (this.returned_delivery) {
            this.deliverydetails(this.returned_delivery._id);
            this.disableDeliverySelect = false;
        }
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

    // this.getFinishedDeliveries = () => {
    //     $http.get('/get-finished-deliveries')
    //         .then(response => {
    //             if (response && response.data && response.data.body) {
    //                 $scope.finishedDeliveries = response.data.body;
    //                 if (this.returned_delivery) {
    //                     $scope.deliveryForm.returned_delivery_id = this.returned_delivery._id;
    //                     //console.log('delivery_type', this.returned_delivery.delivery_type)
    //                     this.deliverydetails(this.returned_delivery._id);
    //                 }
    //             }
    //             //console.log('getFinishedDeliveries', response)
    //         });
    // }

    this.setDefaults = () => {
        $scope.deliveryForm.pickup_deadline = "08:00";
        $scope.deliveryForm.pickup_deadline_to = "16:00";
        $scope.deliveryForm.delivery_window_start = '08:00';
        $scope.deliveryForm.delivery_window_end = '16:00';
        $scope.pickup_location_address_patterns.push({default: true, value: 'Other'});
        //$scope.pickup_location_address = $scope.pickup_location_address_patterns[0].value;
    };

    
    this.getUser();
    this.getFinishedDeliveries();

    this.sendRequest = (d, isValid) => {
        if (isValid) {
            var date = new Date($scope.delivery_date);
            date.setDate(date.getDate() + 1);
            console.log("date++++", date)
            var authToken = JSON.parse(localStorage.getItem('apikey'));
            var headers = {'Token': authToken};
            var reqJSON = {
                "delivery_id": $scope.delivery_id,      // d.delivery_id.$modelValue,
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
                    "zip": $scope.delivery_location_zip+"",
                    "city": $scope.delivery_location_city,
                    "address_1": $scope.delivery_location_address_1,
                    "address_2": $scope.delivery_location_address_2 || ""
                },
                "delivery_window": {
                    "from": (d.delivery_window_start ? (d.delivery_window_start || '08:00') : '08:00'),
                    "to": (d.delivery_window_end ? (d.delivery_window_end || '16:00') : '16:00')
                },
                "delivery_label": $scope.delivery_label,
                "delivery_notes": $scope.delivery_notes,
                "delivery_number_of_packages": ($scope.delivery_number_of_packages ? ($scope.delivery_number_of_packages || '1') : '1'),
                "pickup_location": {
                    "description": "",
                    "zip": $scope.pickup_location_zip+"",
                    "city": $scope.pickup_location_city,
                    "address_1": $scope.pickup_location_address_1,
                    "address_2":$scope.pickup_location_address_2 || ""
                },
                "type":"return",
                "returned_delivery_id":this.returned_delivery._id || this.returned_delivery.id,
                "return_request_by":($scope.return_request_by ? $scope.return_request_by : '')
            };
            console.log('reqJSON', reqJSON)
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
                if (error.data&&error.data.error)
                toastr.error($translate.instant(error.data.message));
                    //alert(error.data.error.message);
            });
        }
    }

    this.deliverydetails = (deliveryid) => {
        var authToken = JSON.parse(localStorage.getItem('apikey'));
        var headers = { 'Token': authToken };

        this.minDate = new Date().toString();

        $http.get('/deliverydetails/' + deliveryid)
            .then(response => {
                //console.log(response.data.body)
                if (response.status == 200) {

                    var d = this.changeDeliveryToReturn(response.data.body.delivery);
                    this.getAccountDetail(d.creator).then(account=>{
                        if (account) {
                            this.deliveryCompanyName = account.name;
                            this.recipientName = d.recipientname;
                        }
                    });
                    console.log("get d ====>", d)

                    $scope.deliveryType = d.delivery_type||'';
                    $scope.delivery_location_address_1 = d.deliveryaddress;
                    $scope.delivery_location_city = d.deliverycity;
                    $scope.delivery_id = d.deliveryid;
                    $scope.assignedDepartment = d.department;
                    $scope.delivery_label = d.deliverylabel || "";
                    $scope.delivery_notes =  "";
                    $scope.delivery_number_of_packages =  d.deliverynumberofpackages?d.deliverynumberofpackages.toString() : '1';
                    $scope.deliveryForm.delivery_window_start = d.deliverywindowstart;
                    $scope.deliveryForm.delivery_window_end = d.deliverywindowend;
                    $scope.delivery_location_zip = d.deliveryzip;
                    $scope.delivery_location_address = d.deliveryaddress + ", " + d.deliveryzip + " " + d.deliverycity + ", Denmark";
                    $scope.delivery_location_country = "Denmark";
                    $scope.delivery_location_address_2 = d.deliveryaddress2 || "";
                    $scope.driver_email = d.driveremail;
                    $scope.pickup_location_address_1 = d.pickupaddress;
                    $scope.pickup_location_address = d.pickupaddress + ", " + d.pickupzip + " " + d.pickupcity + ", Denmark";
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
                    
                    if (d.returndata) {
                        var dt = new Date(d.deliverydate);
                    }
                    else {
                        var dt = new Date();
                    }
                    
                    console.log("return date". dt)

                    //$scope.delivery_date = dt.toLocaleString("en-us", { month: "long" }) + " " + dt.getUTCDate() + ", " + dt.getUTCFullYear();
                    $scope.delivery_date = dt.toLocaleString("en-us", { month: "long" }) + " " + dt.getUTCDate() + ", " + dt.getUTCFullYear();
                    $scope.week_number = d.weekNumber;
                    $scope.delivery_day_of_week = d.deliverydayofweek;
                    $scope.deliveryForm.status = d.status;
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

                    console.log("d ====>", $scope.deliveryForm)
                } else {
                    console.log("Got error response");
                }
                console.log("$stateParams.returned_delivery$$$=======>", $stateParams.returned_delivery)
                if ($stateParams.returned_delivery && this.returnDeliveryIdFlag == true) {
                    this.returnDeliveryIdFlag = false;
                    console.log("return delivery Id------", this.returned_delivery.deliveryid)
                    $scope.deliveryForm.returned_delivery_id = this.returned_delivery.deliveryid;
                }
            })
    }

    this.changeDeliveryToReturn = (delivery) => {
        let returnDelivery = JSON.parse(JSON.stringify(delivery));

        dt = new Date();
        date = dt.toLocaleString("en-us", {month: "long"}) + " " + dt.getDate() + ", " + dt.getFullYear();
        returnDelivery.deliverydate = date;

        returnDelivery.deliveryaddress = delivery.pickupaddress;
        returnDelivery.deliveryaddress2 = delivery.pickupaddress2;
        returnDelivery.deliverycity = delivery.pickupcity;
        returnDelivery.deliverycoordinates = delivery.pickupcoordinates;
        returnDelivery.deliveryzip = delivery.pickupzip;

        returnDelivery.pickupaddress = delivery.deliveryaddress;
        returnDelivery.pickupaddress2 = delivery.deliveryaddress2;
        returnDelivery.pickupcity = delivery.deliverycity;
        returnDelivery.pickupcoordinates = delivery.deliverycoordinates;
        returnDelivery.pickupzip = delivery.deliveryzip;
        returnDelivery.status = 1;

        return returnDelivery;
    }

    this.changeReturnedDelivery = (form) => {
        if(form.returned_delivery_id ) {
            this.deliverydetails(form.returned_delivery_id );
        } else {
            
        }
    }

    this.getAccountDetail=(accountId) => {
        return new Promise((resolve, reject)=>{
            $http.get('/account-detail/' + accountId).then(response=>{
                if (response.status == 200) {
    
                    var account = this.changeDeliveryToReturn(response.data.body.account);
                    //console.log('account', account)
                    resolve(account);
                }
                else {
                    resolve(null);
                }
            })
        })
        
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
        console.log("changeDepartment", $scope.currentDepartment)
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

    this.moveLeft = () =>{
        var lastScrollLeft = $(".drag-scroll-row").scrollLeft();
        $(".drag-scroll-row").animate( {scrollLeft: lastScrollLeft - 100}, 100);
    }

    this.moveRight = () =>{
        var lastScrollLeft = $(".drag-scroll-row").scrollLeft();
        $(".drag-scroll-row").animate( {scrollLeft: lastScrollLeft + 100}, 100);
    }

    this.getWeek = (tmpDate, start) => {
        //Calcing the starting point
        var today = new Date(tmpDate.setHours(0, 0, 0, 0));
        var day = today.getDay() - start;
        var date = today.getDate() - day;
        // Grabbing Start/End Dates
        var StartDate = new Date(today.setDate(date));
        var EndDate = new Date(today.setDate(date + 6));
        return StartDate;
    }

    this.getWeekNumber = (date) => {
        var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        var dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d.valueOf() - yearStart.valueOf()) / 86400000) + 1) / 7)
    };

    this.w2date = (year, wn, dayNb) => {
        var j10 = new Date( year,0,10,12,0,0),
            j4 = new Date( year,0,4,12,0,0),
            mon1 = j4.getTime() - j10.getDay() * 86400000;
        return new Date(mon1 + ((wn - 1)  * 7  + dayNb) * 86400000);
    };
      
    this.setDateBlocks = () => {
        let dateBlocks = [];
        let curDate = new Date();
        let deliverydate = moment($scope.delivery_date);
    
        var dateWeek = new Date();
        this.currentWeekNumber = this.getWeekNumber(dateWeek);

        for (let i = 0; i <= 6; i++) {
          var date = this.getWeek(dateWeek, i);
          let active = deliverydate.startOf('day').diff(moment(date).startOf('day'), 'days') === 0;
    
          dateBlocks.push({
            id: i,
            date: date,
            dayName: moment(date).format("dddd"),
            monthName: moment(date).format("MMM"),
            day: date.getDate(),
            active: active,
            currentActive: active,
          })
        }
        this.dateBlocks = dateBlocks;
    }

    this.setTimeBlocks = () => {
        let timeBlocks = [];
        let curTimeFrom = 0
        let dateTimeHour = 3; //parseInt(this.timeFrom.hour);
    
        // var dateTime = new Date();
        // var dateTimeHour = dateTime.getHours();
        
        for (let i = 0; i < 12; i++) {
    
          let active = (dateTimeHour >= i*2+1 && dateTimeHour < i*2+3) ? true : false;
          let tmpFromTimeHour = i*2 + 1;
          let tmpToTimeHour = i*2 + 3;
          let showFromHour = (tmpFromTimeHour < 10) ? ('0' + tmpFromTimeHour) : (tmpFromTimeHour);
          let showToHour = (tmpToTimeHour < 10) ? ('0' + tmpToTimeHour) : (tmpToTimeHour);
          
          timeBlocks.push({
            id: i,
            fromTimeHour: showFromHour,  
            fromTimeMin: '00',
            toTimeHour: showToHour,
            toTimeMin: '00',
            active: active,
            currentActive: active,
          })
        }
        this.timeBlocks = timeBlocks;
    }

    this.prevWeek = () => {
        let dateBlocks = [];
        let curDate = new Date();
        let deliverydate = moment($scope.deliveryForm.deliverydate);
        // let deliverydate = moment(curDate);
        
        var date = new Date();
        
        this.currentWeekNumber = this.currentWeekNumber - 1;
        // if (this.currentWeekNumber <= 0) {
        //   this.currentWeekNumber = 53;
        //   var dateWeek = this.w2date(date.getFullYear()-1, this.currentWeekNumber, 0);
        // }
        // else {
          var dateWeek = this.w2date(date.getFullYear(), this.currentWeekNumber, 0);
        // }
            
        for (let i = 0; i <= 6; i++) {
          var date = this.getWeek(dateWeek, i);
          let active = deliverydate.startOf('day').diff(moment(date).startOf('day'), 'days') === 0;
    
          dateBlocks.push({
            id: i,
            date: date,
            dayName: moment(date).format("dddd"),
            monthName: moment(date).format("MMM"),
            day: date.getDate(),
            active: active,
            currentActive: active,
          })
        }
        this.dateBlocks = dateBlocks;
    }

    this.nextWeek = () => {
        let dateBlocks = [];
        let curDate = new Date();
        let deliverydate = moment($scope.deliveryForm.deliverydate);
        // let deliverydate = moment(curDate);
        
        var date = new Date();
        
        this.currentWeekNumber = this.currentWeekNumber + 1;
        // if (this.currentWeekNumber > 53) {
        //   this.currentWeekNumber = 1;
        //   var dateWeek = this.w2date(date.getFullYear()+1, this.currentWeekNumber, 0);
        // }
        // else {
          var dateWeek = this.w2date(date.getFullYear(), this.currentWeekNumber, 0);
        // }
            
        for (let i = 0; i <= 6; i++) {
          var date = this.getWeek(dateWeek, i);
          let active = deliverydate.startOf('day').diff(moment(date).startOf('day'), 'days') === 0;
    
          dateBlocks.push({
            id: i,
            date: date,
            dayName: moment(date).format("dddd"),
            monthName: moment(date).format("MMM"),
            day: date.getDate(),
            active: active,
            currentActive: active,
          })
        }
        this.dateBlocks = dateBlocks;
    }

    this.setActiveDate = (id) => {
        this.dateBlocks = this.dateBlocks.map(item => {
          item.active = false;
          return item;
        });
        let foundBlock = this.dateBlocks.find(item => item.id === id);
        if (foundBlock) {
          foundBlock.active = true;
          this.disabledActions = false;
        }
        $scope.deliveryForm.deliverydate = foundBlock.date;
        $scope.delivery_date = foundBlock.date;
        
        console.log("date", $scope.deliveryForm.deliverydate);
    }

    this.setActiveTime = (id) => {
        this.timeBlocks = this.timeBlocks.map(item => {
          item.active = false;
          return item;
        });
        let foundBlock = this.timeBlocks.find(item => item.id === id);
        if (foundBlock) {
          foundBlock.active = true;
          //this.disabledActions = false;
        }
        $scope.deliveryForm.delivery_window_start = foundBlock.fromTimeHour + ':' + foundBlock.fromTimeMin;
        $scope.deliveryForm.delivery_window_end = foundBlock.toTimeHour + ':' + foundBlock.toTimeMin;
        console.log("from time", $scope.deliveryForm.delivery_window_start);
        console.log("to time", $scope.deliveryForm.delivery_window_end);
    }      
}
