var module = angular.module("app")
module.component("ratings", {
    templateUrl: "../components/ratings/ratings.component.html",
    controllerAs: "model",
    controller: ["$http", "$state", "$translate", "spinnerService", "deliveryService", "dateService", "$scope", controller]
});

function controller($http, $state, $translate, spinnerService, deliveryService, dateService, $scope) {

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

    this.statuses = [
        {id: 1, value: $translate.instant('daily_deliveries.created')},
        {id: 2, value: $translate.instant('daily_deliveries.in_progress')},
        {id: 3, value: $translate.instant('daily_deliveries.finished')},
    ];

    this.spinnerChecker = spinnerService;

    this.currentDepartment = '';
    this.getDateRangeOfWeek = deliveryService.getDateRangeOfWeekForShorten;

    this.limitCount = 1;

    this.isOverLimit = false;
    this.showAll = false;
    this.ratings = [];
    this.reviewRatings = [];
    this.statusRatings = [];

    this.selectedValue = "0";
    this.selectedStatus = "0";

    this.totalCnt = 0;
    this.averageReview = 0;

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

    this.filteredRatings = [];
    this.search = '';

    this.totalItems = 0;
    this.limit = 10;
    this.currentPage = 1;

    this.$onInit = () => {
        setOptions();
        this.getData();
        //this.getStatisticsData();
    };

    this.filterRatings = function () {
        this.filteredRatings = this.search ? this.reviewRatings.filter((item) => {
            let found = false;
            if (item.deliveryid) {
                found = item.deliveryid.toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase()) > -1
            }

            if (!found && item.client_name) {
                found = item.client_name.toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase()) > -1
            }

            if (!found && item.client_address) {
                found = item.client_address.toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase()) > -1
            }

            return found;
        }) : this.reviewRatings.slice(0);
        this.totalItems = this.filteredRatings.length;
    };

    this.getData = () => {
        //var apiCallUrl  = '/weekly_deliveries/delivery/' + $state.params.departmentname;
        spinnerService.show();
        
        $http.get('/getDeliveryRatings')
        .then(res=>{
            console.log("res")
            if (res&&res.data) {
                
                console.log('res===>', res.data.body)
                this.ratings = res.data.body;
                this.reviewRatings = res.data.body;
                this.filteredRatings = this.ratings.slice();
                this.totalItems = this.filteredRatings.length;

                var totalReview = 0;
                for (var i = 0; i < this.ratings.length; i++) {
                    totalReview = totalReview + this.ratings[i].review;
                }
                this.totalCnt = this.ratings.length;
                this.averageReview = parseInt(totalReview * 100 / this.totalCnt) / 100;
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


    this.selectReview = () => {
        var selectedReviewRatings = [];
        if (this.ratings) {
            if(parseInt(this.selectedValue) == 0 && parseInt(this.selectedStatus) == 0) {
                this.reviewRatings = this.ratings;
            }
            else {
                for (var i = 0; i < this.ratings.length; i++) {
                    var elem = {};
                    if ((parseInt(this.selectedValue) == 0 && this.ratings[i].status == parseInt(this.selectedStatus)) ||
                        (parseInt(this.selectedStatus) == 0 && this.ratings[i].review == parseInt(this.selectedValue)) ||
                        (this.ratings[i].review == parseInt(this.selectedValue) && this.ratings[i].status == parseInt(this.selectedStatus))) {
                        elem = this.ratings[i];
                        selectedReviewRatings.push(elem);
                    }
                }
                this.reviewRatings = [];
                this.reviewRatings = selectedReviewRatings;
            }
        }
        this.filteredRatings = this.reviewRatings;
        this.totalItems = this.filteredRatings.length;
    }

    this.showDate = (date) => {
        var reDate = new Date(date);
        var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][reDate.getMonth()];
        var day = reDate.getDate();
        var reDay = (day < 10) ? ('0' + day) : day;
        return month + ' ' + reDay;
    }

    this.showStatus = (value) => {
        if (value && value.rating_delivery && value.rating_delivery.length > 0) {
            let val = value.rating_delivery[0].status;
            if (val == 1) {
                return 'Created';
            }
            else if (val == 2) {
                return 'In Progress';
            }
            else if (val == 3) {
                return 'Finished';
            }
            else {
                return '';
            }
        }
        else {
            return '';
        }
    }
}