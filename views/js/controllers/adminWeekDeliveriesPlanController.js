angular.module('adminexpandWeeklyPlan', ['ngAutocomplete'])
    .controller('adminWeekDeliveriesPlanController', function($scope,$http) {
        //now will defined enable and disable of edit, delete button
        $scope.now = (new Date());
        $scope.now.setDate($scope.now.getDate()+1);
        $scope.now = (new Date($scope.now.setHours(5,30,0,0))).toISOString();
        $scope.selectedClient = JSON.parse(localStorage.getItem('selectedClient'));

        function init() {
            $scope.week = {};
            $scope.showRoutes = true;
            $scope.statusConstant = scheduledStatus;
            $scope.week.weekNo = JSON.parse(localStorage.getItem('week'));
            $scope.currentWeekNo = 1;//(new Date()).getWeek();
            $scope.selectedWeek = $scope.week.weekNo.toString();
            $scope.lastWeekNo = (new Date('12/31/' + (new Date().getFullYear()))).getWeek();
            $scope.weekArray = [];
            $scope.weekForSelect = JSON.parse(localStorage.getItem('weekForSelect'));
            $scope.weekForSelect = $scope.weekForSelect.sort();
            for (i = $scope.currentWeekNo; i <= $scope.lastWeekNo; i++) {
                var itemResult  = _.filter($scope.weekForSelect,function (item) {
                    return item == i;
                });
                if(itemResult && itemResult.length ) {
                    var option = 'Week ' + (i) + ' - ' + moment(weeksToDate(new Date().getFullYear(), i, 0)).format('DD/MM') + ' to ' + moment(weeksToDate(new Date().getFullYear(), i, 6)).format('DD/MM');
                    $scope.weekArray.push({value: i, description: option});
                }
            }
            $scope.week.date = moment(weeksToDate(new Date().getFullYear(), $scope.week.weekNo, 0)).format('MMM DD') + ' to ' + moment(weeksToDate(new Date().getFullYear(), $scope.week.weekNo, 6)).format('MMM DD');
            getRoutes($scope.week.weekNo);
        }
        /*
         * grouped deliveries date wise
         */

        function getDaysDeliveries(){
            if($scope.routes){
                _.forEach($scope.routes, function(route){
                    if(route.solution && route.solution.routes && route.solution.routes.length){
                        $scope.showRoutes = true;
                    } else {
                        $scope.showRoutes = false;
                    }
                    _.forEach(route.solution.routes, function(dayRoutes){
                        dayRoutes.activities.splice(0,1);
                        dayRoutes.activities.splice((dayRoutes.activities.length - 1) ,1);
                        _.forEach(dayRoutes.activities, function(service, index){
                            var delivery = _.filter($scope.weekPlan, function(data){
                                return service.location_id == data.deliveryid;
                            })[0];
                            if(index == 0){
                                if(delivery.carrier && delivery.carrier.status == 7){
                                    var deliveryTime = _.filter(delivery.carrier.progressLog, function(progress){
                                        return progress.toStatus == 7;
                                    });
                                    if(deliveryTime && deliveryTime.length){
                                        delivery.deliveryTime = moment(deliveryTime[0].when).format("hh:mm A");
                                    }
                                } else{
                                    var now = new Date();
                                    var currentTime = moment(now).format('HH:mm A');
                                    if(moment(currentTime, 'HH:mm A') < moment(delivery.deliverywindowstart, 'HH:mm A') || (new Date(delivery.deliverydate)) > now){
                                        var t = moment(delivery.deliverywindowstart, 'HH:mm A');
                                        now.setHours(t.get('hour'), t.get('minute'), 0, 0);
                                    }
                                    var deliveryDate = new Date(now.setSeconds(now.getSeconds() + (5*60 + (service.eta && service.eta.arrivingInSeconds ? service.eta.arrivingInSeconds : 0))));
                                    delivery.expactedDeliveryTime = moment(deliveryDate).format('hh:mm A');
                                }
                            } else {
                                if(delivery.carrier && delivery.carrier.status == 7){
                                    var deliveryTime = _.filter(delivery.carrier.progressLog, function(progress){
                                        return progress.toStatus == 7;
                                    });
                                    if(deliveryTime && deliveryTime.length){
                                        delivery.deliveryTime = moment(deliveryTime[0].when).format("hh:mm A");
                                    }
                                } else{
                                    var now = new Date();
                                    if(dayRoutes.activities[index - 1].expactedDeliveryTime){
                                        var t = moment(dayRoutes.activities[index - 1].expactedDeliveryTime, 'hh:mm A');
                                        now.setHours(t.get('hour'), t.get('minute'), 0, 0);
                                    }
                                    var deliveryDate = new Date(now.setSeconds(now.getSeconds() + (5*60 + (service.eta && service.eta.arrivingInSeconds ? service.eta.arrivingInSeconds : 0))));
                                    delivery.expactedDeliveryTime = moment(deliveryDate).format('hh:mm A');
                                }
                            }
                            Object.assign(service, delivery);
                            if(index == 1){
                                dayRoutes.routeDate = service.deliverydate;
                            }
                        })
                    });
                });
            }
        }

        /*
         * function to get the week of a year from a date
         */
        Date.prototype.getWeek = function() {
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

        /**
         * get the date of a particular day of particular week of a year
         * @param y: year
         * @param w: week no
         * @param d: day of week
         */
        function weeksToDate(y,w,d) {
            var simple = new Date(y, 0, 1 + (w - 1) * 7);
            var dow = simple.getDay();
            var ISOweekStart = simple;
            if (dow <= 4)
                ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
            else
                ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
            ISOweekStart.setDate(ISOweekStart.getDate()+d);
            return ISOweekStart;
        }

        /**
         * GET route API to get routes of a day of week
         * @param week: weekNo
         * @param day: day of week
         */
        function getRoutes(week) {
            $http({
                url: '/routes/'+ week,
                method: "GET",
                params: {userId: $scope.selectedClient._id}
            }).then(function (res) {
                    if (res.data && res.data && res.data.routes) {

                        $scope.weekPlan = res.data.weekPlan;
                        $scope.routes = res.data.routes;
                        getDaysDeliveries();
                    }
                },
                function (err) {
                });
        }

        $scope.edit = function(delivery){
            delivery.edit = true;
        };

        //remove the delivery
        $scope.remove = function (delivery,index,routes) {
            //ask for confirmation
            bootbox.confirm("Are you Sure you want to delete!", function (confirmation) {
                if(confirmation) {
                    $http.delete('/api/scheduledDelivery/'+delivery._id).then(function(res){
                        if(res.status == 204){
                            //update the result after deletion
                            routes.splice(index,1);
                        } else {
                            console.log('Error in deletion.');
                        }
                    }, function(err){

                    });
                }
            });

        };
        $scope.editAction = function(delivery,type,index){
            if(type){
                delivery.edit = false;
                console.log(delivery);
                var newData  = {
                    deliveryId:delivery.deliveryid,
                    recipientname:delivery.recipientname,
                    recipientemail:delivery.recipientemail,
                    recipientphone:delivery.recipientphone,
                    deliveryaddress:delivery.deliveryaddress,
                    recipientclientid:delivery.recipientclientid,
                    comment:delivery.comment,
                    clientId : $scope.selectedClient._id
                };
                $http.put('/api/scheduledDelivery/'+delivery._id, {delivery:JSON.stringify(newData)}).then(function(res){

                }, function(err){

                });
            }
            else{
                delivery.edit = false;
            }
        };

        $scope.getWeekPlanOfSelectedWeek =function(){
            $scope.week.weekNo = $scope.selectedWeek;
            $scope.week.date = moment(weeksToDate(new Date().getFullYear(), $scope.selectedWeek, 0)).format('MMM DD') + ' to ' + moment(weeksToDate(new Date().getFullYear(), $scope.selectedWeek, 6)).format('MMM DD');
            getRoutes($scope.selectedWeek);
        };

        $scope.viewDetail = function(delivery, driver, index){
            delivery.index = index < 10 ? '0' + index : index;
            localStorage.setItem('scheduleDelivery',JSON.stringify(delivery));
            localStorage.setItem('driver',JSON.stringify(driver));
            window.location.href = "/adminDeliveryLiveTracking";
        };
        init();
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
                                scope.details = place.formatted_address;//[{readable:place.formatted_address,geo:[place.geometry.location.lng(),place.geometry.location.lat()]}];
                            }
                            else if(place.name==""){
                                scope.details = "";
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
