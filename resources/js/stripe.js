import {loadStripe} from '@stripe/stripe-js';
import {placeOrder} from './apiService';

export async function initStripe() {
    const stripe = await loadStripe('pk_test_51J2WCSSBMtSj7aQx6txJSPqvUM1zm1FLn8YLHByPraYKQL3L8biFAFuNMWV9OKhU2oe5yIcVdljapIqWiKRtMNVd00eCn0IY0u');
    let card = null;
    
    function mountWidget() {
        const elements = stripe.elements()
    
        let style = {
            base: {
            color: '#32325d',
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

         card = elements.create('card', {style, hidePostalCode: true})
        card.mount('#card-element')
    }


    const paymentType = document.querySelector('#paymentType')
    if(paymentType) {
        paymentType.addEventListener('change', (e) => {
            // console.log(e.target.value)
    
            if(e.target.value === 'card') {
                // Display Widget
                mountWidget()    
            } else {
                // Destroy
                card.destroy()
            }
        })
    }
    
    // AJAX Call
    const paymentForm = document.querySelector('#payment-form')
    if(paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let formData = new FormData(paymentForm)
            let formObject = {}
            
            for(let [key, value] of formData.entries()) {
                formObject[key] = value
            }


            if(!card) {
                placeOrder(formObject)
                return;
            }

            // Verify Card
            stripe.createToken(card).then((result) => {
                // console.log(result.token.id)
                formObject.stripeToken = result.token.id
                placeOrder(formObject)
            }).catch((err) => {
                console.log(err)
            })

            // console.log(formObject)
        })
    }
}