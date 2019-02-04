module.component("paymentsteppay", {
    templateUrl: "../components/payment/payment-step-pay.component.html",
    controllerAs: "ctrl",
    bindings: {
        validateFlow: '&',
        saveSettings: '&',
        changeStep: '&'
    },
    controller: ["$http", "toastr", "spinnerService", controller]
});

function controller($http, toastr, spinnerService) {
    let stripe = Stripe('pk_live_4W6pQpu0LPFtz8M6ng1ksB7o');
    let lang = localStorage.getItem('lang');

    let elements = stripe.elements({locale: lang ? lang : "da"});
    let style = {
        base: {
            color: '#32325d',
            lineHeight: '18px',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            }
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    };
    this.error = '';

// Create an instance of the card Element.
    let card = elements.create('card', {style: style});
    card.mount('#card-element');
    card.addEventListener('change', (event) => {
        if (event.error) {
            this.error = event.error.message;
        } else {
            this.error = '';
        }
    });

    this.submitPayment = ($event) => {
        if (!this.validateFlow()) return false;
        spinnerService.show();
        $event.preventDefault();

        stripe.createToken(card).then((result) => {
            if (result.error) {
                this.error = result.error.message;
                spinnerService.hide();
            } else {
                // Send the token to your server.
                this.stripeTokenHandler(result.token);
            }
        });
        return false;
    };

    this.stripeTokenHandler = (token) => {
        $http({
            method: 'POST',
            url: '/payment',
            data: {stripeToken: token.id},
        }).then((res) => {
            spinnerService.hide();
            if (res.data && res.data.body) {
               if (res.data.body.success && res.data.body.charge.paid) {
                   toastr.success('Successfully paid!');
                   this.saveSettings();
               } else {
                   toastr.error(res.data.body.error);
                   console.log(res.data.body.error);
               }
            }
        });

    }
}
