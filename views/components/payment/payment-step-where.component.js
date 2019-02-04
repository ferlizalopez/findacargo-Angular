module.component("paymentstepwhere", {
    templateUrl: "../components/payment/payment-step-where.component.html",
    controllerAs: "ctrl",
    bindings: {
        whereVariants: '<',
        changeStep: '&'
    },
    controller: [controller]
});

function controller() {

    this.select = (variant) => {
        variant.active = !variant.active;
    }
}
