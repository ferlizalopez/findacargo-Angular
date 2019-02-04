module.component("paymentstepdetails", {
    templateUrl: "../components/payment/payment-step-details.component.html",
    controllerAs: "ctrl",
    bindings: {
        finishStep: "<",
        details: "=",
        changeStep: '&',
        finish: '&'
    },
    controller: [controller]
});

function controller() {

}
