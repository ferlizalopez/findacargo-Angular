var module = angular.module("app")
module.component("weeklyreturns", {
    templateUrl: "../components/returns/weeklyreturns.component.html",
    controllerAs: "model",
    controller: ["$http", "$state", "spinnerService", "deliveryService", "dateService", "$scope", controller]
});

function controller($http, $state, spinnerService, deliveryService, dateService, $scope) {

    /* this is for chart */
    $scope.monthNames = ["January", "February", "March", "April", "May", "June", "July",
     "August","September", "October", "November", "December"];
    $scope.labels = [];
    $scope.series = ['Deliveries', 'Returns'];
    $scope.data = [];

    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };
    $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];

    function setOptions(){
        $scope.options = {
            responsive: true,
            legend: {
                position: 'bottom'
            },
            hover: {
                mode: 'label'
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }
                }],
                yAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
            /*title: {
                display: true,
                text: 'Chart.js Line Chart - Legend'
            }*/
        };
    }
    /* end chart js */

    this.spinnerChecker = spinnerService;

    this.currentDepartment = '';
    this.getDateRangeOfWeek = deliveryService.getDateRangeOfWeekForShorten;

    this.limitCount = 10;

    this.isOverLimit = false;
    this.showAll = false;


    this.getTodayWeekNumber = () => {
        let today = new Date();
        /*var onejan = new Date(today.getFullYear(),0,1);
        return Math.ceil((((today - onejan) / 86400000) + onejan.getDay()+1)/7);*/
        return dateService.getISOWeek(today);
    }

    this.weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.currentWeekNumber = this.getTodayWeekNumber();
    this.today = new Date();
    this.currentYear = this.today.getFullYear();
    this.currentDay = this.weekdays[this.today.getDay()].toLowerCase();

    this.$onInit = () => {
        setOptions();
        this.getData();
        this.getStatisticsData();
    };

    this.getData = () => {
        //var apiCallUrl  = '/weekly_deliveries/delivery/' + $state.params.departmentname;
        spinnerService.show();
        $http.get('/weekly_deliveries/return')
            .then(res => {
                if (res.data.body) {
                    this.weekly_returns = deliveryService.prepareWeeklyList(res.data.body)
                }

                if (res.data.body) {
                    //this.currentDepartment = $state.params.departmentname;
                    this.all_weekly_returns = deliveryService.prepareWeeklyList(res.data.body)
                }
                if (this.all_weekly_returns && this.all_weekly_returns.length > this.limitCount) {
                    this.weekly_returns = this.all_weekly_returns.slice(this.all_weekly_returns.length - this.limitCount, this.all_weekly_returns.length);
                    this.isOverLimit = true;
                }
                else {
                    this.weekly_returns = this.all_weekly_returns;
                }
                spinnerService.hide();
            })
    };

    this.getStatisticsData = () => {
        var now = new Date();
        var thisYear = (new Date()).getFullYear();    
        var start = new Date("1/1/" + thisYear);
        var defaultStart = moment(start.valueOf());
        let end = moment();

        let promises = [];

        let deliveryStatis = new Promise((resolve, reject)=>{
            $http.get('/get-delivery-return-stats', {params: {start: defaultStart.format('MMMM D, YYYY'), end: end.format('MMMM D, YYYY')}}).then( (res) => {
                if (res.data&&res.data.msg=='Success') {
                    resolve(res.data);
                }
                else {
                    reject(new Error(res.data.msg));
                }
            },  (err) => {
                reject(err);
            });
        })
        
        let returnStatis = new Promise((resolve, reject)=>{
            $http.get('/get-delivery-return-stats', {params: {start: defaultStart.format('MMMM D, YYYY'), end: end.format('MMMM D, YYYY'), type:'return'}}).then( (res) => {
                if (res.data&&res.data.msg=='Success') {
                    resolve(res.data);
                }
                else {
                    reject(new Error(res.data.msg));
                }
            },  (err) => {
                reject(err);
            });
        })
        promises.push(deliveryStatis);
        promises.push(returnStatis);

        Promise.all(promises).then((values)=>{
            //console.log('values', values)
            this.generateGraphData(values);
            if($scope.myNewChart != null){
                $scope.myNewChart.destroy();
                this.createNewChart();
            }

            if ($scope.data&&$scope.data.length>0)
                this.drawChart($scope.data[0], $scope.data[1], $scope.labels);
        })
        .catch(err=>{
            console.log('err', err)
        })

    }


    this.generateGraphData = (values) => {
        if (values&&values.length>1) {
            let deliveryData = values[0].body;
            let returnData = values[1].body;

            var now = new Date();

            let deliveryStatsValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            let returnStatsValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

            $scope.labels = $scope.monthNames.slice(0,now.getMonth()+1);

             
            deliveryData.map(deliveryStats=>{
                deliveryStatsValues[deliveryStats._id-1] = deliveryStats.counts;
            })

            returnData.map(returnStats=>{
                returnStatsValues[returnStats._id-1] = returnStats.counts;
            })

            $scope.data.push(deliveryStatsValues);
            $scope.data.push(returnStatsValues);

            //console.log($scope.labels, $scope.data)
        }
    }

    this.drawChart=(deliveryData, returnData, labels)=>{
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        var dat = {
            labels: labels,
            datasets: [
                {
                    label: "Deliveries",
                    data: deliveryData
                },
                {
                    label: "Returns",
                    backgroundColor: "rgba(26, 179, 148, 0.5)",
                    borderColor: "rgba(26, 179, 148, 0.5)",
                    data: returnData
                }
            ]
        };
        //console.log(labels, deliveryData, returnData)
        var config = {
            type: "line",
            data: dat,
            options: $scope.options
        };
        $scope.myNewChart = new Chart(ctx , config);
    }

    this.createNewChart=()=>{
        var lineChartContent = document.getElementById('lineChartContent');
        lineChartContent.innerHTML = '&nbsp;';
        $('#lineChartContent').append('<canvas id="canvas" style="height: 176px; width: 100%;margin-top: 20px;"><canvas>');
    }

    this.toggleShowHide = () => {
        this.showAll = !this.showAll;
        if (this.showAll) {
            this.weekly_returns = this.all_weekly_returns;
        }
        else {
            this.weekly_returns = this.all_weekly_returns.slice(this.all_weekly_returns.length - this.limitCount, this.all_weekly_returns.length);
        }
    }

    this.isTodayCell = (year, weekNumber, weekDay) => {
        if (this.currentYear == year && this.currentWeekNumber == weekNumber && this.currentDay == weekDay) {
            return true;
        }
        else {
            return false;
        }
    }

}