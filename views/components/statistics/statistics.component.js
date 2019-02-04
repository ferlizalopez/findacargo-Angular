var module = angular.module("app");
module.component("statistics", {
    templateUrl: "../components/statistics/statistics.component.html",
    controllerAs: "model",
    controller: ["$scope", "$http", "$state", "$stateParams", "$location", controller]
});

function controller($scope, $http, $state, $stateParams, $location) {
    $scope.chart = {};
    // var lng = $scope.lang = i18n.detectLanguage();
    var lng = "en";
    var lang;
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
    function drawChart(nonCompletedData, completedData, labels){
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        var dat = {
            labels: labels,
            datasets: [
                {
                    label: "Non Completed",
                    data: nonCompletedData
                },
                {
                    label: "Completed",
                    backgroundColor: "rgba(26, 179, 148, 0.5)",
                    borderColor: "rgba(26, 179, 148, 0.5)",
                    data: completedData
                }
            ]
        };
        var config = {
            type: "line",
            data: dat,
            options: $scope.options
        };
        $scope.myNewChart = new Chart(ctx , config);
    }

    function createNewChart(){
        var lineChartContent = document.getElementById('lineChartContent');
        lineChartContent.innerHTML = '&nbsp;';
        $('#lineChartContent').append('<canvas id="canvas" style="height: 176px; width: 757px;margin-top: 20px;"><canvas>');
    }

    function arrangeStatsData(statsData, start, end){
        var labels = [];
        var nonCompletedData = [];
        var completedData = [];
        $scope.totalDeliveries = 0;
        $scope.failedDeliveries = 0;
        $scope.onTimeDeliveries = 0;
        for(var d = new Date(start.format('MMMM D, YYYY')); d <= new Date(end.format('MMMM D, YYYY')); d.setDate(d.getDate() + 1)){
            var oneDayStats = statsData.filter(function(dayStats){
                return new Date(moment(dayStats._id).format('MMMM D, YYYY')).valueOf() == d.valueOf();
            });
            labels.push(moment(d).format('D MMM'));
            if(oneDayStats && oneDayStats.length){
                $scope.totalDeliveries = $scope.totalDeliveries + oneDayStats[0].data.length;
                var onTime = oneDayStats[0].data.filter(function(delivery){
                    console.log("delivery - ", delivery);
                    if(delivery.status == 3){
                        var deliveryTime = delivery.progressLog.filter(function(progress){
                            return progress.toStatus == 3;
                        });
                        if(deliveryTime && deliveryTime.length){
                            delivery.deliveryTime = moment(deliveryTime[0].when).format("hh:mm A");
                            return (moment(delivery.deliverywindowend, 'HH:mm A') >= moment(delivery.deliveryTime, 'HH:mm A'));
                        }
                    }
                });
                $scope.onTimeDeliveries = $scope.onTimeDeliveries + onTime.length;
                oneDayStats[0].completedDeliveries = oneDayStats[0].data.filter(function(delivery){
                    return delivery.status == 3;
                });
                oneDayStats[0].nonCompletedDeliveries = oneDayStats[0].data.filter(function(delivery){
                    return (!(delivery.carrier) || (delivery.status != 3));
                });
                $scope.failedDeliveries = $scope.failedDeliveries + oneDayStats[0].nonCompletedDeliveries.length;
                nonCompletedData.push(oneDayStats[0].nonCompletedDeliveries.length);
                completedData.push(oneDayStats[0].completedDeliveries.length);
            } else {
                nonCompletedData.push(0);
                completedData.push(0);
            }
        }
        $scope.failedDeliveries = 0;//temp
        $scope.onTimeDeliveries = $scope.totalDeliveries;//temp
        $scope.failedDeliveriesPercentage = Math.round($scope.failedDeliveries * 100 / $scope.totalDeliveries);
        $scope.ontimedDeliveriesPercentage = Math.round($scope.onTimeDeliveries * 100 / $scope.totalDeliveries);
        if($scope.myNewChart != null){
            $scope.myNewChart.destroy();
            createNewChart();
        }
        if(labels.length == 1){
            labels.unshift(' ');
            labels.push(' ');
            nonCompletedData.unshift(0);
            nonCompletedData.push(0);
            completedData.unshift(0);
            completedData.push(0);
        }
        drawChart(nonCompletedData, completedData, labels);

    }

    function init(){
        var statsData = JSON.parse(localStorage.getItem('statisticsDates'));
        $scope.start = statsData ? moment(statsData.startDate) : moment();
        $scope.end = statsData ? moment(statsData.endDate) : moment();
        $scope.error = '';
        if(lng === 'en') {
            $scope.range = {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            };
        } else if(lng === 'da') {
            $scope.range = {
                'I dag': [moment(), moment()],
                'I går': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Sidste 7 dage': [moment().subtract(6, 'days'), moment()],
                'Sidste 30 dage': [moment().subtract(29, 'days'), moment()],
                'Denne måned': [moment().startOf('month'), moment().endOf('month')],
                'Sidste måned': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            };
        }
        setOptions();
        $('#reportrange').daterangepicker({
            startDate: $scope.start,
            endDate: $scope.end,
            ranges: $scope.range,
            maxDate: new Date()
        }, cb);

        cb($scope.start, $scope.end, $scope.range);
        $scope.selectedRange = statsData ? statsData.selectedRange : 'Today';
    }

    function cb(start, end, range) {
        $scope.selectedRange = range;
        var now = new Date();
        if(new Date(start.format('MMMM D, YYYY')) > now){
            $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));

        } else {
            $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            $http.get('/statisticsData', {params: {start: start.format('MMMM D, YYYY'), end: end.format('MMMM D, YYYY')}}).then(function (res) {
                if (res.data && res.data && res.data.statsData) {
                    $scope.statsData = res.data.statsData;
                    if($scope.statsData.length){
                        localStorage.setItem('statisticsDates',JSON.stringify({startDate: start, endDate: end, selectedRange: $scope.selectedRange}));
                        arrangeStatsData(res.data.statsData, start, end);
                    }
                }
            }, function (err) {

            });
        }
    }
    init();
}