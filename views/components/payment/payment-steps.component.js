module.component("paymentsteps", {
    templateUrl: "../components/payment/payment-steps.component.html",
    controllerAs: "ctrl",
    controller: ["$http", "$timeout", "urlService", "toastr", "spinnerService", "$translate", controller]
});

function controller($http, $timeout, urlService, toastr, spinnerService, $translate) {
    this.progress = 10;
    this.types = [];
    this.whenDays = [
        "same",
        "next",
    ];
    this.whereVariants = [
        {value: "StorKøbenhavn", active: false},
        {value: $translate.instant('payment.rest_of_sealand'), active: false},
        {value: "Fyn", active: false},
        {value: "Jylland", active: false}
    ];
    this.step = null;
    this.details = {
        name: "",
        phone: "",
        email: "",
        needs: "",
    };
    this.steps = {
        types: "types",
        companydetails: "companydetails",
        details: "details",
        where: "where",
        when: "when",
        pay: "pay",
    };
    this.validationMessages = [];

    this.flows = [
        {
            name: "packages",
            flow: [this.steps.types, this.steps.when, this.steps.companydetails, this.steps.pay],
        },
        {
            name: "catering",
            flow: [this.steps.types, this.steps.companydetails, this.steps.details],
        },
        {
            name: "mealboxes",
            flow: [this.steps.types, this.steps.where, this.steps.companydetails, this.steps.details],
        },
        {
            name: "other",
            flow: [this.steps.types, this.steps.companydetails, this.steps.details],
        },
    ];
    this.validationTypes = [this.steps.companydetails, this.steps.details];
    this.finishStep = false;

    this.companyDetails = {
        company_address: {
            address: '',
            street: '',
            city: '',
            floor: '',
            zip: '',
            country: '',
        },
        pickup_address: {
            address: '',
            street: '',
            city: '',
            floor: '',
            zip: '',
            country: '',
        },
        cvr_nr: '',
        company_name: '',
    };
    this.currentStep = 1;
    this.selectedType = '';
    this.selectedWhen = '';

    this.$onInit = () => {
        this.types = this.flows.map(item => item.name);
        this.step = this.steps.types;
    };

    this.selectType = (type) => {
        this.selectedType = type;
    };

    this.changeStep = (increased) => {
        this.finishStep = false;
        let flowObject = this.flows.find(item => item.name === this.selectedType);
        let indexStep = flowObject.flow.indexOf(this.step);

        let numberSteps = flowObject.flow.length;
        this.currentStep = indexStep + 1;

        if (increased) {
            this.nextStep(flowObject, numberSteps, indexStep);
        } else {
            this.previousStep(flowObject, numberSteps, indexStep);
        }
    };

    this.nextStep = (flowObject, numberSteps, indexStep) => {
        if (this.currentStep < numberSteps) {
            this.step = flowObject.flow[++indexStep];
            this.progress = (100 / numberSteps) * this.currentStep;
            this.currentStep++;
        } else {
            this.finish();
        }

        if (this.currentStep === (numberSteps)) {
            this.finishStep = true;
        }
    };

    this.finish = () => {
        if (!this.validateFlow()) return false;

        this.saveSettings();
    };

    this.saveSettings = () => {
        let settings = this.generateSettings();

        let authToken = JSON.parse(localStorage.getItem('apikey'));
        let headers = {'Token': authToken};
        $http({
            method: 'POST',
            url: urlService.getApiUrl() + '/v1/settings/signup-settings',
            data: settings,
            headers: headers
        }).then((res) => {
            if (res.data) {
                toastr.success('Settings successfully saved!');
                setCookie('approved', true, 365);
                spinnerService.show();
                $timeout(() => {
                    window.location.href = '/';
                }, 1000);
            }
        });
    };

    this.previousStep = (flowObject, numberSteps, indexStep) => {
        if (this.currentStep > 1) {
            this.step = flowObject.flow[--indexStep];
            this.currentStep--;
            this.progress = (this.currentStep === 1) ? 10 : (100 / numberSteps) * (this.currentStep - 1);
        }
    };


    this.validateFlow = () => {
        let flowObject = this.flows.find(item => item.name === this.selectedType);
        let flow = flowObject.flow;
        let isValid = true;
        let messages = [];
        let whenIndex = flow.indexOf(this.steps.when);
        let companyDetailsIndex = flow.indexOf(this.steps.companydetails);
        let detailsIndex = flow.indexOf(this.steps.details);
        let whereIndex = flow.indexOf(this.steps.where);

        if (whenIndex > -1) {
            if (!this.selectedWhen) {
                messages.push("'When' on the step " + (whenIndex + 1));
            }
        }
        if (companyDetailsIndex > -1) {
            if (!this.companyDetails.cvr_nr || !this.companyDetails.company_name
                || !this.companyDetails.company_address.street || !this.companyDetails.company_address.city || !this.companyDetails.company_address.zip
                || !this.companyDetails.pickup_address.street || !this.companyDetails.pickup_address.city || !this.companyDetails.pickup_address.zip
            ) {
                messages.push("Your company details on the step " + (companyDetailsIndex + 1));
            }
        }
        if (detailsIndex > -1) {
            if (!this.details.name || !this.details.phone || !this.details.email || !this.details.needs) {
                messages.push("Your details on the step " + (detailsIndex + 1));
            }
        }
        if (whereIndex > -1) {
            if (this.whereVariants.every(item => item.active === false)) {
                messages.push("'Where' on the step " + (whereIndex + 1));
            }
        }

        if (messages.length > 0) {
            this.validationMessages = messages;
            $("#validationStepsModal").modal();
            isValid = false;
        }

        return isValid;

    };

    this.generateSettings = () => {
        let flowObject = this.flows.find(item => item.name === this.selectedType);
        let flow = flowObject.flow;
        let settings = {};

        let whenIndex = flow.indexOf(this.steps.when);
        let companyDetailsIndex = flow.indexOf(this.steps.companydetails);
        let detailsIndex = flow.indexOf(this.steps.details);
        let whereIndex = flow.indexOf(this.steps.where);
        let payIndex = flow.indexOf(this.steps.pay);

        settings.type = this.selectedType;
        if (whenIndex > -1) {
            settings.when = this.selectedWhen;
        }
        if (companyDetailsIndex > -1) {
            settings.company_details = this.companyDetails;
        }
        if (detailsIndex > -1) {
            settings.details = this.details;
        }
        if (whereIndex > -1) {
            settings.destinations = this.whereVariants.filter(item => !!item.active).map(item => item.value);
        }

        return settings;
    }

}
