angular.module('adminWeeklyPlan', [])
    .controller('adminWeeklyPlanController', function($scope, $http, $timeout) {

        $scope.selectedClient = JSON.parse(localStorage.getItem('selectedClient'));
        $scope.weekForSelect = [];
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

        /*
         * Arrange week plan by grouping deliveries according to date
         */
        function getWeekPlan(){
            _.forEach($scope.weekPlan, function(data){

                $scope.weekForSelect.push(data._id);

                var counts = _.countBy(data.data, function(delivery){
                    return (delivery.day).toLowerCase();
                });
                var route = _.filter($scope.routes, function(item){
                    return item._id == data._id;
                })[0];
                data.routes = {};
                /*data.startDate = weeksToDate(new Date().getFullYear(), data._id + 1, -1);
                 data.endDate = weeksToDate(new Date().getFullYear(), data._id + 1, 5);*/
                data.date = moment(weeksToDate(new Date().getFullYear(), data._id, 0)).format('MMM DD') + ' to ' + moment(weeksToDate(new Date().getFullYear(), data._id, 6)).format('MMM DD');
                data.count = counts;
                _.forEach(route && route.data, function(obj){
                    data.routes[(obj.day).toLowerCase()] = obj.routes;
                });
            });
        }

        $scope.currentWeekNo = (new Date()).getWeek();
        $scope.weekPlan = weekPlan;
        $scope.routes = weekPlan && weekPlan.length && routes;
        console.log('delivery data', $scope.weekPlan, $scope.routes);
        $scope.success = "";
        $scope.error = "";

        getWeekPlan();

        /*
         * navigate to expand deliveries day wise of a particular week
         */
        $scope.expandDayPlan = function(weekPlan){
            localStorage.setItem('week',JSON.stringify(weekPlan._id));
            localStorage.setItem('weekForSelect',JSON.stringify($scope.weekForSelect));
            window.location.href = "/adminroute/"+ weekPlan._id;
        };

        $scope.deleteWeekPlan = function(week, index){
            //ask for confirmation
            bootbox.confirm("The entire week's plan will be deleted. Are you sure?", function (confirmation) {
                if(confirmation) {
                    $http.get('/checkDeliveryStarted/'+ week,{params:{currentWeek:$scope.currentWeekNo,userId:$scope.selectedClient._id}}).then(function (res) {
                        if(res && res.data && res.data.data == 'delvieries_not_started') {
                            bootbox.alert('Route cannot be deleted as some of the deliveries are not started yet.');
                        } else {
                            if(week){
                                $http.delete('/deleteWeekPlan/'+week).then(function(res){
                                    if(res.status == 204){
                                        //update the result after deletion
                                        $scope.weekPlan.splice(index,1);
                                        $scope.success = 'Week Plan successfully deleted';
                                        $timeout(function () {
                                            $scope.success = "";
                                        }, 4000);
                                    } else {
                                        $scope.error = 'Some error occurred in deletion';
                                        $timeout(function () {
                                            $scope.error = "";
                                        }, 4000);
                                    }
                                }, function(err){
                                    $scope.error = 'Some error occurred in deletion';
                                    $timeout(function () {
                                        $scope.error = "";
                                    }, 4000);
                                });
                            } else {
                                $scope.error = 'Some error occurred in deletion';
                                $timeout(function () {
                                    $scope.error = "";
                                }, 4000);
                            }
                        }
                    },function (e) {
                        console.log(e);
                        $scope.error = 'Some error occurred in deletion';
                        $timeout(function () {
                            $scope.error = "";
                        }, 4000);
                    });
                }
            });
        };

        $scope.viewDayWiseRoutes = function (day,weekPlan) {
            localStorage.setItem('day',JSON.stringify(day));
            localStorage.setItem('week',JSON.stringify(weekPlan._id));
            localStorage.setItem('selectedClient',JSON.stringify($scope.selectedClient));
            window.location.href = "/admindayroute";
        }

    });
