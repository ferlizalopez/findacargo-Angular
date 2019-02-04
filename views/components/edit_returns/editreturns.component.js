var module = angular.module("app");
module.component("editreturns", {
    templateUrl: "../components/edit_returns/editreturns.component.html",
    controllerAs: "model",
    controller: ["$http", "$state", "$stateParams", "$scope", "toastr", "urlService", "$timeout", "$translate", controller]
});

function controller($http, $state, $stateParams, $scope, toastr, urlService, $timeout, $translate) {

    $scope.pickup_location_address_patterns = [];
    $scope.custom_pickup_location_address = '';
    $scope.pickup_location_address = '';

    this.pickup_components_showed = false;
    $scope.deliveryForm = null;
    this.userInfo = null;
    $scope.currentDepartment = {}
    let defaultDepartmensCookie = getCookie('departmentData');

    returnDate = '';
    returnStart = '';
    set3hours = false;

    this.dateBlocks = {};
    this.timeBlocks = {};
    this.disabledActions = true;
    this.currentWeekNumber = 0;

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

    Date.prototype.getWeek = function () {
        var onejan = new Date(this.getFullYear(), 0, 1);
        return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    }

    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    $scope.deliveryTypes = [
        { "value": "", "name": "Select a delivery type" },
        { "value": "Express / On-demand", "name": "Express / On-demand" },
        { "value": "Distribution", "name": "Distribution" },
        { "value": "Dedicated Drivers", "name": "Dedicated Drivers" },
    ]

    $scope.carTypes = [
        { "value": "Small van", "name": "Small van" },
        { "value": "Van (3 pallets)", "name": "Van (3 pallets)" },
        { "value": "BoxVan with lift (6 pallets)", "name": "BoxVan with lift (6 pallets)" },
        { "value": "Box Van with lift (8 pallets)", "name": "Box Van with lift (8 pallets)" }
    ]

    $scope.distributions = [
        { "value": "Under 40 kg", "name": "Under 40 kg" },
        { "value": "1 pallet", "name": "1 pallet" },
        { "value": "1/2 EU pallet", "name": "1/2 EU pallet" },
        { "value": "1/4 EU pallet", "name": "1/4 EU pallet" }
    ]
    var that = this;

    this.$onInit = () => {
        //console.log("call on init function")
        this.setTimeIntervalFunc();
        // this.setDateBlocks();
        // this.setTimeBlocks();
    };

    this.deliverydetails = () => {
        var deliveryid = $stateParams.id;

        var authToken = JSON.parse(localStorage.getItem('apikey'));
        var headers = { 'Token': authToken };

        this.minDate = new Date().toString();

        $http.get('/deliverydetails/' + deliveryid)
            .then(response => {
                console.log(response.data.body)
                if (response.status == 200) {

                    var d = response.data.body.delivery;

                    $scope.delivery_location_address_1 = d.deliveryaddress;
                    $scope.delivery_location_city = d.deliverycity;
                    $scope.delivery_id = d.deliveryid;
                    $scope.assignedDepartment = d.department;
                    $scope.delivery_label = d.deliverylabel || "";
                    $scope.delivery_notes = d.deliverynotes || "";
                    $scope.deliveryForm.delivery_number_of_packages = d.deliverynumberofpackages ? d.deliverynumberofpackages.toString() : '1';
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
                    var dt = new Date(d.deliverydate);

                    this.returnDate = dt;
                    this.returnStart = d.deliverywindowstart;

                    //$scope.delivery_date = dt.toLocaleString("en-us", { month: "long" }) + " " + dt.getUTCDate() + ", " + dt.getUTCFullYear();
                    $scope.delivery_date = dt.toLocaleString("en-us", { month: "long" }) + " " + dt.getUTCDate() + ", " + dt.getUTCFullYear();
                    $scope.week_number = d.weekNumber;
                    $scope.delivery_day_of_week = d.deliverydayofweek;
                    $scope.deliveryForm.status = d.status;
                    $scope.deliveryStatusOptions = [
                        { "value": 1, "name": $translate.instant('common.created') },
                        { "value": 2, "name": $translate.instant('common.in_progress') },
                        { "value": 3, "name": $translate.instant('common.finished') }
                    ];
                    $scope.deliveryCountryOptions = [
                        { "value": "45", "name": "(+45) " },
                        { "value": "46", "name": "(+46) " },
                    ];
                    $scope.deliveryStatus = $scope.deliveryStatusOptions.filter(function (obj) {
                        return obj.value == d.status;
                    })[0].value;

                    var deliveryCountryObj = _.find($scope.deliveryCountryOptions, (obj) => {
                        return obj.value == d.recipientphone.country_dial_code;
                    })

                    $scope.deliveryCountry = '45' //default
                    if (deliveryCountryObj) {
                        $scope.deliveryCountry = deliveryCountryObj.value
                    }

                    console.log('$scope.deliveryCountry', $scope.deliveryCountry)

                    let curdate = new Date();
                    this.calculateDiffTime(curdate);

                    this.setDateBlocks();
                    this.setTimeBlocks();
                } else {
                    console.log("Got error response");
                }
            })
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
        console.log("del value", del);
        console.log("$scope.delivery_date", $scope.delivery_date);

        if (isValid) {
            
            var localDate = new Date($scope.delivery_date)
            var utcDate = new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate()))
            //console.log("del.delivery_date.$modelValue", utcDate, del.delivery_date.$modelValue, new Date(del.delivery_date.$modelValue), $scope.delivery_date)
            var week = utcDate.getISOWeek();
            var day = utcDate.getDay();
            var authToken = JSON.parse(localStorage.getItem('apikey'));
            var headers = { 'Token': authToken };

            console.log("req delivery date", utcDate)
            var reqJSON = {
                "pickupdeadline": (del.pickup_deadline),
                "pickupdeadlineto": (del.pickup_deadline_to),
                "deliverywindowstart": del.delivery_window_start,
                "deliverywindowend": del.delivery_window_end,
                "deliverydate": utcDate,
                "weekNumber": week,
                "deliverydayofweek": days[day],
                "status": $scope.deliveryStatus,
            }


            $http.post('/update_delivery/' + $stateParams.id, reqJSON)
                .then(response => {
                    if (response.data.success === true) {
                        toastr.success('Delivery Details Updated Successfully.');
                        window.location.href = '/#!/returndetails/' + $stateParams.id;
                    }
                })
        }
    }

    this.showPickupComponents = () => {
        this.pickup_components_showed = true;
    }

    this.changeDepartment = (e) => {
        $scope.currentDepartment = $scope.departments.filter(function (obj) {
            if (obj.name == $scope.assignedDepartment) {
                return obj;
            }
        })[0]
        console.log("changeDepartment", $scope.currentDepartment)
    }

    this.precheck = (form) => {
        if (form.deliveryType == '') return false
        if (form.deliveryType == 'Express / On-demand' && !form.deliveryCarType) return false
        if (form.deliveryType == 'Distribution' && !form.deliveryDistribution) return false

        return true
    }

    this.precheckExpress = (form) => {
        if (form.deliveryType == 'Express / On-demand' && form.deliveryCarType) return true

        return false
    }

    this.getExpressCost = (form) => {
        if (form.deliveryCarType == 'Small van' || form.deliveryCarType == 'Van (3 pallets)') {
            return '320 dkk + moms per hour'
        } else {
            return '390 dkk + moms per hour'
        }
    }


    this.getDiffTimesBetween = (date1, date2) => {
        //Get 1 minute in milliseconds
        var oneMinutes = 1000 * 60;

        // Convert both dates to milliseconds
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();

        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;

        return Math.round(difference_ms / oneMinutes);
    }
    /* calcualte the time difference between delivery time and current time */
    this.calculateDiffTime = (currentTime) => {
        
        if (this.returnDate && this.returnStart) {
            let deliveDate = new Date(this.returnDate);

            let deliveryYear = deliveDate.getUTCFullYear();
            let deliveryMonth = deliveDate.getUTCMonth() + 1;
            let deliveryDay = deliveDate.getUTCDate();

            let deliveryDate = deliveryYear + '-' + deliveryMonth + '-' + deliveryDay + ' ' + this.returnStart;

            let deliveryStartDateTime = new Date(deliveryDate);
            
            let diff = this.getDiffTimesBetween(currentTime, deliveryStartDateTime);

            if (diff >= 180) {
                this.set3hours = false;
            }
            else {
                this.set3hours = true;
            }
        }
        return this.set3hours;
    }

    /* time setting */
    this.setTimeIntervalFunc = () => {
        let cnt = 0;

        setInterval(() => {
            let date = new Date();

            this.calculateDiffTime(date);
        }, 10000)
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
        console.log("delivery date222", $scope.deliveryForm)
        let dateBlocks = [];
        //let curDate = new Date();
        let deliverydate = moment($scope.delivery_date);
    
        var dateWeek = new Date(deliverydate);
        this.currentWeekNumber = this.getWeekNumber(dateWeek);
        console.log("current week number", this.getWeekNumber(dateWeek))
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
        console.log("date block", this.dateBlocks)
    }

    this.setTimeBlocks = () => {
        console.log("set time blocks")
        let timeBlocks = [];
        let curTimeFrom = 0
        let timeFrom = $scope.deliveryForm.delivery_window_start.split(":");
        timeFrom.hour = timeFrom[0];
        timeFrom.minute = timeFrom[1];

        let dateTimeHour = parseInt(timeFrom.hour);
        console.log("deliveryTIME", dateTimeHour)
    
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
        console.log("timeBlock", this.timeBlocks)
    }

    this.prevWeek = () => {
        let dateBlocks = [];
        let curDate = new Date();
        let deliverydate = moment($scope.delivery_date);
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
    
        console.log("current week number", this.getWeekNumber(dateWeek))
        
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
        let deliverydate = moment($scope.delivery_date);
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
        
        console.log("current week number", this.getWeekNumber(dateWeek))
    
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