var module = angular.module("app");

module.component("dailydeliveries", {
    templateUrl: "../components/scheduled_deliveries/dailydeliveries.component.html",
    controllerAs: "model",
    controller: ["$http", "storageService", "$stateParams", "$state", "$translate", "$timeout", "$scope", "urlService", "toastr", "statusService", "dateService", "spinnerService", "deliveryService", controller]
});

function controller($http, storageService, $stateParams, $state, $translate, $timeout, $scope, urlService, toastr, statusService, dateService, spinnerService, deliveryService) {
    this.approved = storageService.getApproved();

    this.statuses = [
        {id: 1, value: $translate.instant('daily_deliveries.created')},
        {id: 2, value: $translate.instant('daily_deliveries.in_progress')},
        {id: 3, value: $translate.instant('daily_deliveries.finished')},
    ];
    
    this.printedStatuses = [
        {id: 1, value: $translate.instant('daily_deliveries.already_printed')},
        {id: 2, value: $translate.instant('daily_deliveries.not_printed')},
    ];

    this.spinnerChecker = spinnerService;
    this.daily_deliveries = [];
    this.totalItems = 0;
    this.currentPage = 1;

    this.currentLabel = null;
    this.statistics = {
        delivered: '0/0',
        complete: '0',
        last_delivery: '',
    };

    this.printedFilterStatus = localStorage.getItem('deliveriesPrintedFilterStatus') || '';
    this.filterStatus = localStorage.getItem('deliveriesFilterStatus') || '';
    this.limit = parseInt(localStorage.getItem('deliveriesLimitStatus')) || 50;
    
    this.filterStatusName = '';
    this.printedFilterStatusName = '';

    this.notificationMessage = "";
    this.customNotificationMessage = "";
    this.deliveryNotificated = {};

    this.notificationPatterns = [];
    this.notificationMessage = '';
    this.currentDepartment = '';
    this.selectAll = false;
    this.selectedItems = false;
    this.minDate = new Date().toString();

    let defaultDepartmensCookie = getCookie('departmentData');
    if (defaultDepartmensCookie) {
        let deps = JSON.parse(defaultDepartmensCookie).departments;
        if (deps.length > 0) {
            $scope.departments = deps;
        }
    }

    this.changeFilterStatus = () => {
        this.currentPage = 1;
        this.getDeliveries();
        localStorage.setItem('deliveriesFilterStatus', this.filterStatus);
        localStorage.setItem('deliveriesPrintedFilterStatus', this.printedFilterStatus);
        this.setStatusName();
    };

    this.setStatusName = () => {
        this.filterStatusName = this.filterStatus ? this.statuses.find(item => parseInt(item.id) === parseInt(this.filterStatus)).value : '';
        this.printedFilterStatusName = this.printedFilterStatus ? this.printedStatuses.find(item => parseInt(item.id) === parseInt(this.printedFilterStatus)).value : '';
    };

    this.$onInit = () => {
        this.setStatusName();
        this.getDeliveries();
        this.getDeliveriesStatistic();
        this.getNotificationTemplates();
    };

    Date.prototype.getWeek = function () {
        let onejan = new Date(this.getFullYear(), 0, 1);
        return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    };

    this.setPrinted = (delivery) => {
        $http.put('/set-delivery-printed/' + delivery._id, {printed: delivery.printed})
        .then(function (res) {
                if (res.data.success) {
                    let printed = res.data.body.printed ? $translate.instant('daily_deliveries.printed_status') : $translate.instant('daily_deliveries.unprinted_status');
                    toastr.success($translate.instant('daily_deliveries.delivery_was_set') + printed);
                }        
        }, function (err) {
            toastr.error($translate.instant('daily_deliveries.cannot_change_printed_status'));
        });
    };

    this.toggleSelectDelivery = (delivery) => {
        this.selectAll = false;
        if (delivery.isSelected) {
            if (delivery.status == 1) {
                this.selectedItems = true;
            }
            else {
                this.selectedItems = false;
                delivery.isSelected = false;
            }
        }

    }

    this.toggleSelectAll = () => {
        if (this.daily_deliveries) {
            for (var i = 0; i < this.daily_deliveries.length; i++) {
                if (this.daily_deliveries[i].status != 1) {
                    this.daily_deliveries[i].isSelected = false;
                }
                else {
                    this.daily_deliveries[i].isSelected = this.selectAll;
                    this.selectedItems = this.selectAll;
                }
            }
        }
    }

    this.getDeliveries = () => {
        spinnerService.show();
        this.currentDepartment = $stateParams.departmentname;
        console.log("current department name", this.currentDepartment)
        if (this.currentDepartment) {
            var route = '/daily_deliveries/' + $stateParams.year + '/' + $stateParams.weeknumber + '/' + $stateParams.day + '/' +  this.currentDepartment;
        } else {
            var route = '/daily_deliveries/' + $stateParams.year + '/' + $stateParams.weeknumber + '/' + $stateParams.day;
        }
        route += "?limit=" + this.limit;
        route += "&offset=" + ((this.currentPage - 1) * this.limit);
        route += "&type=delivery";

        if (this.filterStatus) {
            route += "&status=" + this.filterStatus;
        }

        if (this.printedFilterStatus) {
            route += "&printed=" + this.printedFilterStatus
        }

        localStorage.setItem('deliveriesLimitStatus', this.limit);

        $http.get(route)
            .then(res => {
                
                this.daily_deliveries = res.data.body.deliveries.map(item => {
                    item.deletable = deliveryService.checkForDeletable(item);
                    return item;
                });
                /* for test of phone number */
                // this.daily_deliveries[0].recipientphone.country_dial_code = "";
                // this.daily_deliveries[0].recipientphone.phone = "+4512345678";
                
                console.log('daily_deliveries', this.daily_deliveries)

                spinnerService.hide();
            }, () => {
                spinnerService.hide();
            });
    };

    this.getDeliveriesStatistic = () => {
        spinnerService.show();
        let route = '/daily_deliveries_statistics/' + $stateParams.year + '/' + $stateParams.weeknumber + '/' + $stateParams.day;
        route += "?type=delivery&department=" + ($stateParams.departmentname||'');

        $http.get(route)
            .then(res => {
                //console.log('getDeliveriesStatistic', res.data.body)
                this.totalItems = res.data.body.total;
                this.statistics.delivered = res.data.body.delivered;
                this.statistics.complete = res.data.body.complete;
                if (res.data.body.last_delivery) {
                    this.statistics.last_delivery = res.data.body.last_delivery;
                }
                spinnerService.hide();
            }, () => {
                spinnerService.hide();
            })

    };

    this.extractAddress1 = deliveryService.extractAddress1;


    this.changeDateSelected = () => {
        var date = moment(this.assignedDate).format('YYYY-MM-DD');
        let promises = [];
        let isContainUndeletableItems = false;
        
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        //Delete the delivery
        this.daily_deliveries.map(item => {
            if (item.isSelected&&item.deletable) {
                
                promises.push($http.put('/set-delivery-date/' + item._id, {deliverydate: date}));
                //console.log('deleting', item._id)
            }
            else if (item.isSelected&&!item.deletable) {
                isContainUndeletableItems = true;
            }
        });
        
        if (isContainUndeletableItems) {
            //You selected in progress or finished deliveries. Only created deliveries will be applied.
            alert($translate.instant('daily_deliveries.selected_progress_finished'));
        }

        return Promise.all(promises)
        .then((result)=>{
            if (result&&result.length>0) {
                toastr.success($translate.instant('daily_deliveries.delivery_updated'));
               
                window.history.back();
            }
            else {
                //There is no change. 
                window.alert($translate.instant('daily_deliveries.no_change'));
            }
           
            $("#changeDate").modal("hide");
        }).catch(err=>{            
            window.alert("Error occurred");
            $("#changeDate").modal("hide");
        })
       
    }

    this.changeDepartmentSelected = () => {
        
        let promises = [];
        let isContainUndeletableItems = false;
        //Delete the delivery
        this.daily_deliveries.map(item => {
            if (item.isSelected&&item.deletable) {
                promises.push($http.put('/set-delivery-department/' + item._id, {department: this.assignedDepartment}));
            }
            else if (item.isSelected&&!item.deletable) {
                isContainUndeletableItems = true;
            }
        });
        
        if (isContainUndeletableItems) {
            //You selected in progress or finished deliveries. Only created deliveries will be applied.
            alert($translate.instant('daily_deliveries.selected_progress_finished'));
        }

        return Promise.all(promises)
        .then((result)=>{
            if (result&&result.length>0) {
                toastr.success($translate.instant('daily_deliveries.delivery_updated'));
            }
            else {
                //There is no change. 
                window.alert($translate.instant('daily_deliveries.no_change'));
            }
            $("#changeDepartment").modal("hide");
        }).catch(err=>{
            window.alert("Error occurred");
            $("#changeDepartment").modal("hide");
        })
    }

    this.deleteSelected = () => {
        if (confirm($translate.instant('daily_deliveries.are_you_sure_delete'))) {
            let promises = [];
            let isContainUndeletableItems = false;
            //Delete the delivery
            this.daily_deliveries.map(item => {
                if (item.deletable&&item.isSelected) {
                    
                    promises.push($http.delete('/delete_delivery/' + item._id));
                    //console.log('deleting', item._id)
                }
                else if (item.isSelected&&!item.deletable) {
                    isContainUndeletableItems = true;
                }
            });

            if (isContainUndeletableItems) {
                //You selected in progress or finished deliveries. Only created deliveries will be applied.
                alert($translate.instant('daily_deliveries.selected_progress_finished'));
            }
            
            return Promise.all(promises)
            .then(()=>{
                this.getDeliveries();
                this.getDeliveriesStatistic();
                if (result&&result.length>0) {
                    toastr.success($translate.instant('daily_deliveries.delivery_deleted'));
                }
                else {
                    //There is no change. 
                    window.alert($translate.instant('daily_deliveries.no_change'));
                }
            }).catch(err=>{
                this.getDeliveries();
                this.getDeliveriesStatistic();
                window.alert($translate.instant('daily_deliveries.no_change'));
                //toastr.success($translate.instant('daily_deliveries.delivery_deleted'));
            })
        }
    }

    this.deleteDelivery = (id) => {
        if (confirm($translate.instant('daily_deliveries.are_you_sure'))) {
            //Delete the delivery
            $http.delete('/delete_delivery/' + id)
                .then(res => {
                    if (res.data.success === true) {
                        //window.location.href = '/#!/' + $stateParams.weeknumber + '/' + $stateParams.day;
                        this.getDeliveries();
                        this.getDeliveriesStatistic();
                        toastr.success($translate.instant('daily_deliveries.delivery_deleted'));
                    }
                })
        } else {
            // Do nothing!
        }

    }

    this.setdeliverydetails = (d) => {
        localStorage.setItem('deliverydetails', JSON.stringify(d));
    };

    this.getStatus = function (id) {
        return statusService.getStatus(parseInt(id));
    };

    this.setDeliveryBoxes = (id, count) => {
        $http.put('/set-delivery-boxes/' + id, {count: count}).then(function (res) {
        }, function (err) {
        });
    };

    this.changeBoxesCount = (increase) => {
        if (increase) {
            this.currentLabel.deliverynumberofpackages++
        } else {
            if (parseInt(this.currentLabel.deliverynumberofpackages) === 1) return false;
            this.currentLabel.deliverynumberofpackages--;
        }
        this.setDeliveryBoxes(this.currentLabel._id, this.currentLabel.deliverynumberofpackages);
    };

    this.setBoxesCount = () => {
        if (!Number.isInteger(this.currentLabel.deliverynumberofpackages)) {
            this.currentLabel.deliverynumberofpackages = 1;
        }
        this.setDeliveryBoxes(this.currentLabel._id, this.currentLabel.deliverynumberofpackages);
    };

    this.openLabelsSite = () => {
        console.log(this.currentLabel._id);
        window.open('https://labels.goidag.com/' + this.currentLabel._id, '_blank');
        //window.open('http://localhost:1234/' + this.currentLabel._id, '_blank');
        
        $http.put('/set-delivery-printed/' + this.currentLabel._id, {printed: true})
        .then((res) => {
                if (res.data.success) {
                    let printed = res.data.body.printed ? $translate.instant('daily_deliveries.printed_status') : $translate.instant('daily_deliveries.unprinted_status');
                    toastr.success($translate.instant('daily_deliveries.delivery_was_set') + printed);
                    this.currentLabel.printed = true;                    
                }        
        }, function (err) {
            toastr.error($translate.instant('daily_deliveries.cannot_change_printed_status'));
        });
        
    };

    this.openMultipleLabelsSite = (deliveryData) => {
        let userId = localStorage.getItem('userId');
        userId = userId.replace(/^"(.*)"$/, '$1');
        var deliveryIdsArr = [];
        for(let i=0; i < deliveryData.length ; i++) {
            deliveryIdsArr.push(deliveryData[i]._id);
        }
        window.open('https://labels.goidag.com/print/labelmany?&userId=' + userId + '&labels=' + deliveryIdsArr.join() , '_blank');
        //window.open('http://localhost:1234/print/labelmany?&userId=' + userId + '&labels=' + deliveryIdsArr.join() , '_blank');
    };

    this.selectToSend = (id) => {
        this.deliveryNotificated.deliveryId = id;
    };

    this.getNotificationTemplates = function() {
        let authToken = JSON.parse(localStorage.getItem('apikey'));

        return $http({
            method: 'GET',
            url: `${urlService.getApiUrl()}/v1/scheduled/events/notification`,
            headers: {'Token': authToken}
        })
        .then((response) => {
            this.notificationPatterns = response.data;
            this.notificationMessage = 'Other';
        })
    }

    this.sendNotifications = function() {
        let authToken = JSON.parse(localStorage.getItem('apikey'));
        let message = this.notificationMessage !== 'Other' ? this.notificationMessage : this.customNotificationMessage;

        $http({
            method: 'POST',
            url: `${urlService.getApiUrl()}/v1/scheduled/events/notification`,
            data: {notificationMessage: message, deliveryIds: [this.deliveryNotificated.deliveryId], token: authToken},
            headers: {'Token': authToken}
        })
        .then(res => {
            if(res && res.data) {
                this.deliveryNotificated.success = res.data[0].success;
                this.deliveryNotificated.message = res.data[0].message;
                this.deliveryNotificated.display = true;
            } else {
                window.alert("Error occurred");
            }
            $timeout(() => {
                this.deliveryNotificated.display = false;
            }, 9000);
        },(err) => {
            window.alert("Error occurred: " + err.data.error);
        })
    }

    this.openLabel = (item) => {
        this.currentLabel = item;
        if (!this.currentLabel.deliverynumberofpackages) {
            this.currentLabel.deliverynumberofpackages = 1;
            this.setDeliveryBoxes(this.currentLabel._id, this.currentLabel.deliverynumberofpackages);
        } else if (!Number.isInteger(this.currentLabel.deliverynumberofpackages)) {
            this.currentLabel.deliverynumberofpackages = parseInt(this.currentLabel.deliverynumberofpackages);
        }
    }

    this.returnDelivery = (delivery) => {
        $state.go('returnrequest', {returned_delivery: delivery})
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

    this.returnDeliveryDo = (delivery) => {
        if(!confirm('Are you sure?')) {
            return
        }

        console.log('delivery', delivery)
        $http.post(`${urlService.getApiUrl()}/v1/zone-delivery/updatestatus/6`, [delivery._id])
        .then((response) => {
            console.log("response", response)
            delivery.status = 6
        }, (err)=>{
            console.log(err)
        });
    }

    this.formatPhone = (phoneHeader, phoneNum) => {
        if (phoneHeader == "" && phoneNum.startsWith("+")) {
            return phoneNum;
        }
        else if(phoneHeader != "" && !phoneNum.startsWith ("+")){
            return '+' + phoneHeader + ' ' + phoneNum;
        }
        else {
            return phoneNum;
        }
    }

    this.getDeliveryEstimatedTime = (estimate) => {
        if (estimate) {
            if (estimate.includes(".")) {
                var splitTime = estimate.split(".");
            }
            else if (estimate.includes(":")) {
                var splitTime = estimate.split(":");
            }
            return splitTime[0] + ':' + splitTime[1];
        } 
    }

    this.getDeliveryWindowTime = (start, end) => {
        if (start && end) {
            if (start.includes(".")) {
                var startSplitTime = start.split(".");
            }
            else if (start.includes(":")) {
                var startSplitTime = start.split(":");
            }
            if (end.includes(".")) {
                var endSplitTime = end.split(".");
            }
            else if (end.includes(":")) {
                var endSplitTime = end.split(":");
            }
            
            return startSplitTime[0] + ":" + startSplitTime[1] + '-' + endSplitTime[0] + ":" + endSplitTime[1];    
        }
    }

    // this.formatPhone = (phoneNum) => {
    //     if(!phoneNum.startsWith ("+")){
    //         return '+' + phoneNum
    //     }

    //     return phoneNum
    // }

    this.getLocalTime = (timestr) => {
        return moment(new Date(`2018-01-01T${timestr}:00.000Z`)).format("hh:mm A")
    }

    this.getLocalDanTime = (timestr) => {
        let date = new Date(`2018-01-01T${timestr}:00.000Z`);
        date.setHours(date.getHours() - 1);
        return moment(date).format("hh:mm A")
    }

    this.limitedLengthFormat = (str, length) => {
        let res = str;
        if (str&&str.length>length) {
            res = str.substr(0, length)+'..';
        }
        return res;
    }
}
