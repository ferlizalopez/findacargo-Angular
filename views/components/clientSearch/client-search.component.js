module.component("clientSearch", {
    templateUrl: "../components/clientSearch/client-search.component.html",
    controllerAs: "model",
    controller: ["$http", "$sce", "urlService", "$translate", controller]
});

this.selectedColor = null;
function controller($http, $sce, urlService, $translate) {
    this.items = [];
    this.value = '';
    this.maxItemsCount = 5;
    this.searchText = '';
    this.resultText = '';
    this.searchOption = 'normal'

    this.autoCompleteOptions = {
        minimumChars: 2,
        //autoHideDropdown: true,
        selectedTextAttr: 'realValue',
        selectedCssClass: 'colorCode',
        data: (searchText) => {
            this.searchText = searchText;
            return this.makeSearchQuery(1, this.maxItemsCount);
        },
        itemTemplateUrl: 'components/clientSearch/search-autocomplete-item.html',
    };

    this.makeSearchQuery = (page, size) => {
        let authToken = JSON.parse(localStorage.getItem('apikey'));
        let data = {
            keyword: this.searchText
        };
        if (page) data.page = page;
        if (size) data.size = size;
        data.searchOption = this.searchOption
        return $http({
            method: 'POST',
            url: `${urlService.getApiUrl()}/v1/scheduled/clientSearch`,
            data: data,
            headers: {'Token': authToken}
        }).then(response => response.data.items.map(x => {
            return {
                realValue: this.getMatchedProperty(x).value,
                deliveryId: x._id,
                matchedProperty: this.getMatchedProperty(x),
                status: this.getItemStatus(x)
            }
        }));
    };

    this.getArrivalInterval = (estimatedDeliveryTime) => {
        let splitted = estimatedDeliveryTime.trim().split(':');
        let deliveryDate = new Date();
        deliveryDate.setHours(splitted[0]);
        deliveryDate.setMinutes(splitted[1]);
        deliveryDate.setMilliseconds(0);
        let now = new Date();
        let timeGapInMin = Math.floor((deliveryDate.getTime() - now.getTime()) / 1000 / 60);

        if (timeGapInMin <= 0) {
            return $translate.instant('home.delayed');
        }

        return timeGapInMin >= 60
            ? `${Math.floor(timeGapInMin / 60)} hr ${timeGapInMin % 60} min`
            : `${timeGapInMin % 60} min`;
    };

    this.getItemStatus = (delivery) => {
        let deliveryDate = moment(delivery.deliverydate).utc();
        if (parseInt(delivery.status) === 3) {
            return {
                name: deliveryDate.format("L"),
                value: $translate.instant('home.delivered'),
                color: 'green'
            }
        }

        let now = moment(new Date()).utc();
        let todayAndPlanned = delivery.estimated_delivery_time
            && (deliveryDate.diff(now) === 0)
            && parseInt(delivery.status) === 2;

        if (!todayAndPlanned) {
            return {
                name: $translate.instant('home.deliverydate'),
                value: deliveryDate.format("L"),
                color: 'yellow'
            }
        }

        let arrival = this.getArrivalInterval(delivery.estimated_delivery_time);

        if (arrival === 'Delayed') {
            return {
                value: arrival,
                color: 'red'
            }
        }

        return {
            name: $translate.instant('home.estimatedtime'),
            value: arrival,
            color: 'yellow'
        }
    };

    this.getMatchedProperty = (delivery) => {
        let exclude = ['status', 'deliverydate', 'estimated_delivery_time'];
        let propertyLabelMapping = {
            _id: $translate.instant('home.id'),
            deliveryid: $translate.instant('home.deliveryid'),
            recipientid:  $translate.instant('home.recipientid'),
            recipientname: $translate.instant('home.recipientname'),
            deliveryaddress: $translate.instant('home.deliveryaddress'),
            recipientphone: $translate.instant('home.recipientphone'),
            recipientemail: $translate.instant('home.recipientemail')
        };

        console.log("searched result", delivery)

        for (let property in delivery) {
            console.log("property", property)

            if (delivery.hasOwnProperty(property) && !exclude.includes(property)) {
                if (delivery[property].toLowerCase().includes(this.searchText.toLowerCase())) {
                    console.log("searched property", delivery[property])
                    return {
                        name: propertyLabelMapping[property],
                        value: delivery[property]
                    }
                }
            }
        }
    };


    this.search = () => {
        this.isSearched = true;
        this.makeSearchQuery()
            .then((result) => {
                this.items = result;
                this.resultText = ((this.items.length === 0) ? $translate.instant('home.no_results') : $translate.instant('home.search_results')) + `"${this.value}"`;
            })
    }

}
