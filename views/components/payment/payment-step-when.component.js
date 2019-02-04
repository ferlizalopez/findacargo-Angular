module.component("paymentstepwhen", {
    templateUrl: "../components/payment/payment-step-when.component.html",
    controllerAs: "ctrl",
    bindings: {
        selectedWhen: '=',
        whenDays: '<',
        changeStep: '&'
    },
    controller: [controller]
});

function controller() {

    this.select = (day) => {
        this.selectedWhen = day;
        this.changeStep({val: true});
    }
}
