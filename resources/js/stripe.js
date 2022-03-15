import {loadStripe} from '@stripe/stripe-js';
import {placeOrder} from './apiService';

export async function initStripe() {
    const stripe = await loadStripe('pk_test_51KdYO4SI4noICuySSOZ7iWWoxzZvR6FrMzdZUjZ7LtKAYlA33luNEZcca3BeC5NxOr0iYW3RMjmpezPjVg6T0YUU00QwsxZ8Ve');
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