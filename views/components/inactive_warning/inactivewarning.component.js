module.component("inactivewarning", {
    templateUrl: "../components/inactive_warning/inactivewarning.component.html",
    controllerAs: "model",
    controller: ["storageService", controller]
});

function controller(storageService) {
    this.isShown = true;
    this.redirectToPayment = () => {
        this.isShown = false;
    };

    this.$onInit = () => {
        this.approved = storageService.getApproved();
    }
}
