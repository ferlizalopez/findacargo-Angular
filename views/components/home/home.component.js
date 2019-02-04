module.component("home", {
    templateUrl: "../components/home/home.component.html",
    controllerAs: "model",
    controller: ["$http", "$sce", "urlService", "toastr", controller]
});

function controller($http, $sce, urlService, toastr) {
    let successMessage = getCookie('message');
    if (successMessage.length > 0) {
        toastr.success(successMessage);
        document.cookie = "message=;";
    }    
}
