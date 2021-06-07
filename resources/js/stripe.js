import axios from 'axios'
import Noty from 'noty'
import {loadStripe} from '@stripe/stripe-js';

export async function initStripe() {
    const stripe = await loadStripe('pk_test_51Izj6YSJg3PAjrZPjdDP8f7IWMGaq44jBvkTOuwBlUbgptakJyvzmp5ynWBIzSnGIL9pln9q04VmIw49Gy8vKpEf00aOS1wixg');
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
            axios.post('/orders', formObject).then((res) => {
                new Noty({
                    type: 'success',
                    timeout: 1000,
                    text: res.data.message,
                    progressBar: false,
                }).show();

                setTimeout(() => {
                    window.location.href ='/customer/orders'
                }, 1000)            

            }).catch((err) => {
                new Noty({
                    type: 'success',
                    timeout: 1000,
                    text: error.res.data.message,
                    progressBar: false,
                }).show();
            })
        
            console.log(formObject)
        })
    }
}