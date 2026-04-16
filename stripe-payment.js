// stripe-payment.js

// Include Stripe.js library in your HTML:
// <script src="https://js.stripe.com/v3/"></script>

const stripe = Stripe('YOUR_PUBLIC_STRIPE_KEY'); // Replace with your Stripe public key
const elements = stripe.elements();

// Create an instance of a card element
const cardElement = elements.create('card');
cardElement.mount('#card-element'); // The DOM element where the card will be mounted

// Handle form submission
const form = document.getElementById('payment-form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const {paymentMethod, error} = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
    });

    if (error) {
        // Handle error here
        console.error(error);
    } else {
        // Send the paymentMethod.id to your server (e.g., using fetch)
        console.log('Payment method created:', paymentMethod);
        // Optionally, submit the paymentMethod.id to your server
    }
});