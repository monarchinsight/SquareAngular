import {AfterViewInit, Component, OnInit, NgModule} from '@angular/core';

declare var SqPaymentForm : any; //magic to allow us to access the SquarePaymentForm lib

@Component({
  selector: 'app-payment',
  templateUrl: './buy.component.html'
})

export class BuyComponent implements OnInit, AfterViewInit{

  constructor(){}

  paymentForm; //this is our payment form object

  ngOnInit(){
    const paymentForm = new SqPaymentForm({
      // Initialize the payment form elements
      
      //TODO: Replace with your sandbox application ID
      applicationId: "sandbox-sq0idb-1eDJCgCoI4Sb20DE2SmvPQ",
      inputClass: 'sq-input',
      autoBuild: false,
      // Customize the CSS for SqPaymentForm iframe elements
      inputStyles: [{
          fontSize: '16px',
          lineHeight: '24px',
          padding: '16px',
          placeholderColor: '#a0a0a0',
          backgroundColor: 'transparent',
      }],
      // Initialize the credit card placeholders
      cardNumber: {
          elementId: 'sq-card-number',
          placeholder: 'Card Number'
      },
      cvv: {
          elementId: 'sq-cvv',
          placeholder: 'CVV'
      },
      expirationDate: {
          elementId: 'sq-expiration-date',
          placeholder: 'MM/YY'
      },
      postalCode: {
          elementId: 'sq-postal-code',
          placeholder: 'Postal'
      },
      // SqPaymentForm callback functions
      callbacks: {
          /*
          * callback function: cardNonceResponseReceived
          * Triggered when: SqPaymentForm completes a card nonce request
          */
          cardNonceResponseReceived: function (errors, nonce, cardData) {
          if (errors) {
              // Log errors from nonce generation to the browser developer console.
              console.error('Encountered errors:');
              errors.forEach(function (error) {
                  console.error('  ' + error.message);
              });
              alert('Encountered errors, check browser developer console for more details');
              return;
          }
             alert(`The generated nonce is:\n${nonce}`);
             //TODO: Replace alert with code in step 2.1
              
              fetch('process-payment', {
               method: 'POST',
               headers: {
                 'Accept': 'application/json',
                 'Content-Type': 'application/json'
               },
               body: JSON.stringify({
                 nonce: nonce
               })
             })
             .catch(err => {
               alert('Network error: ' + err);
             })
             .then(response => {
               if (!response.ok) {
                 return response.text().then(errorInfo => Promise.reject(errorInfo));
               }
               return response.text();
             })
             .then(data => {
               console.log(JSON.stringify(data));
               alert('Payment complete successfully!\nCheck browser developer console for more details');
             })
             .catch(err => {
               console.error(err);
               alert('Payment failed to complete!\nCheck browser developer console for more details');
             });
          }
      }
    });
    //TODO: paste code from step 1.1.4
      paymentForm.build();
  }

  onGetCardNonce(event) {
    // Don't submit the form until SqPaymentForm returns with a nonce
    event.preventDefault();
    // Request a nonce from the SqPaymentForm object
    this.paymentForm.requestCardNonce();
  }

  ngAfterViewInit(){}
}