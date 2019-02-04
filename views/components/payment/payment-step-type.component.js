module.component("paymentsteptype", {
    templateUrl: "../components/payment/payment-step-type.component.html",
    controllerAs: "ctrl",
    bindings: {
        selectType: '&',
        selectedType: '<',
        types: '<',
        changeStep: '&'
    },
    controller: [controller]
});

function controller() {

    this.select = (type) => {
        this.selectType({type: type});
        this.changeStep({val: true});
    }
}
