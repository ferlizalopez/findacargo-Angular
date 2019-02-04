(function () {
    angular
        .module('app')
        .factory('deliveryService', deliveryService);

    function deliveryService() {
        return {
            checkForDeletable: checkForDeletable,
            getDateRangeOfWeek: getDateRangeOfWeek,
            prepareWeeklyList: prepareWeeklyList,
            extractAddress1: extractAddress1,
            getDateRangeOfWeekForShorten:getDateRangeOfWeekForShorten
        };

        function checkForDeletable(delivery) {
            var deliverydate = moment(delivery.deliverydate).utc();
            var now = moment(new Date()).utc();
            var deletable = false;

            //if (deliverydate.diff(now) > 0 && parseInt(delivery.status) === 1) {
            if (parseInt(delivery.status) === 1) {    
                deletable = true;
            }

            return deletable;
        }


        /*
         the calculations are according to the 'Calculating a date given the year, week number and weekday'
         section here: https://en.wikipedia.org/wiki/ISO_week_date
         */
        function getDateRangeOfWeek(weekNum, year) {
            var correction = (new Date(year, 0, 4).getDay() || 7) + 3;
            var ordinal = weekNum * 7 + 1 - correction;

            var calculatedYear = year;
            if (ordinal < 1) {
                calculatedYear = year - 1;
                ordinal += getDaysCount(calculatedYear);
            } else if (ordinal > getDaysCount(year)) {
                calculatedYear = year + 1;
                ordinal -= getDaysCount(year);
            }

            let fromDate = new Date(calculatedYear, 0, 1);
            fromDate.setDate(fromDate.getDate() + ordinal - 1);

            var toDate = new Date(fromDate);
            toDate.setDate(toDate.getDate() + 6);

            return moment(fromDate).format("MMMM") + ' ' + fromDate.getDate() + ' - ' + moment(toDate).format("MMMM") + ' ' + toDate.getDate();
        }

        function getDateRangeOfWeekForShorten(weekNum, year) {
            var correction = (new Date(year, 0, 4).getDay() || 7) + 3;
            var ordinal = weekNum * 7 + 1 - correction;

            var calculatedYear = year;
            if (ordinal < 1) {
                calculatedYear = year - 1;
                ordinal += getDaysCount(calculatedYear);
            } else if (ordinal > getDaysCount(year)) {
                calculatedYear = year + 1;
                ordinal -= getDaysCount(year);
            }

            let fromDate = new Date(calculatedYear, 0, 1);
            fromDate.setDate(fromDate.getDate() + ordinal - 1);

            var toDate = new Date(fromDate);
            toDate.setDate(toDate.getDate() + 6);

            return moment(fromDate).format("MMM") + ' ' + fromDate.getDate() + ' - ' + moment(toDate).format("MMM") + ' ' + toDate.getDate();
        }

        function checkIfLeap(year) {
            return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
        }

        function getDaysCount(year) {
            return checkIfLeap(year) ? 366 : 365;
        }

        function addDeliveryInfoByWindow(weekyDayInfo, newDeliveryWindow) {
            let ret = JSON.parse(JSON.stringify(weekyDayInfo));
            if (newDeliveryWindow.deliveryWindowStart==null) {
                newDeliveryWindow.deliveryWindowStart = "08:00";
            }
            if (newDeliveryWindow.deliveryWindowEnd==null) {
                newDeliveryWindow.deliveryWindowEnd = "16:00";
            }

            if (ret.length>0) {
                deliveryWindowGroup =  ret.find(deliveryWindow=>{
                    return (deliveryWindow.deliveryWindowStart == newDeliveryWindow.deliveryWindowStart) &&
                    (deliveryWindow.deliveryWindowEnd == newDeliveryWindow.deliveryWindowEnd)
                })

                if (deliveryWindowGroup) {
                    deliveryWindowGroup.count++;
                }
                else {
                    ret.push({...newDeliveryWindow, count:1})
                }
            }
            else {
                ret.push({...newDeliveryWindow, count:1})
            }

            return ret;
        }

        function prepareWeeklyList(weekly_items) {
            if (weekly_items.length < 1) {
                weekly_items = [];
            } else {
                for (let i = 0; i < weekly_items.length; i++) {
                    weekly_items[i].mondayCount = weekly_items[i].tuesdayCount =
                        weekly_items[i].wednesdayCount = weekly_items[i].thursdayCount =
                            weekly_items[i].fridayCount = weekly_items[i].saturdayCount =
                                weekly_items[i].sundayCount = 0;

                    weekly_items[i].mondayInfo = weekly_items[i].tuesdayInfo =
                    weekly_items[i].wednesdayInfo = weekly_items[i].thursdayInfo =
                        weekly_items[i].fridayInfo = weekly_items[i].saturdayInfo =
                            weekly_items[i].sundayInfo = [];
                    
                    for (let j = 0; j < weekly_items[i].daysofweek.length; j++) {

                        if (weekly_items[i].daysofweek[j] === 'Monday') {
                            weekly_items[i].mondayCount++;
                            weekly_items[i].mondayInfo = addDeliveryInfoByWindow(weekly_items[i].mondayInfo, weekly_items[i].deliverywindows[j])
                        } else if (weekly_items[i].daysofweek[j] === 'Tuesday') {
                            weekly_items[i].tuesdayCount++;
                            weekly_items[i].tuesdayInfo = addDeliveryInfoByWindow(weekly_items[i].tuesdayInfo, weekly_items[i].deliverywindows[j])
                        } else if (weekly_items[i].daysofweek[j] === 'Wednesday') {
                            weekly_items[i].wednesdayCount++;
                            weekly_items[i].wednesdayInfo = addDeliveryInfoByWindow(weekly_items[i].wednesdayInfo, weekly_items[i].deliverywindows[j])
                        } else if (weekly_items[i].daysofweek[j] === 'Thursday') {
                            weekly_items[i].thursdayCount++;
                            weekly_items[i].thursdayInfo = addDeliveryInfoByWindow(weekly_items[i].thursdayInfo, weekly_items[i].deliverywindows[j])
                        } else if (weekly_items[i].daysofweek[j] === 'Friday') {
                            weekly_items[i].fridayCount++;
                            weekly_items[i].fridayInfo = addDeliveryInfoByWindow(weekly_items[i].fridayInfo, weekly_items[i].deliverywindows[j])
                        } else if (weekly_items[i].daysofweek[j] === 'Saturday') {
                            weekly_items[i].saturdayCount++;
                            weekly_items[i].saturdayInfo = addDeliveryInfoByWindow(weekly_items[i].saturdayInfo, weekly_items[i].deliverywindows[j])
                        } else if (weekly_items[i].daysofweek[j] === 'Sunday') {
                            weekly_items[i].sundayCount++;
                            weekly_items[i].sundayInfo = addDeliveryInfoByWindow(weekly_items[i].sundayInfo, weekly_items[i].deliverywindows[j])
                        }
                    }
                }
            }
            return weekly_items;
        }

        function extractAddress1(addr) {
            if (!addr) return '';
            let parts = addr.split(",");
            if (parts.length !== 3) {
                return parts[0] + ",";
            }
            else {
                return parts[0] + "," + parts[1] + ",";
            }
        }



    }
})();