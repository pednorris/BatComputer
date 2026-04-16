const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')('your_stripe_secret_key'); // Replace with your Stripe secret key

const app = express();
app.use(bodyParser.json());

// Create a payment intent
app.post('/create-payment-intent', async (req, res) => {
    const { amount, currency } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Confirm a payment intent
app.post('/confirm-payment-intent/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const paymentIntent = await stripe.paymentIntents.confirm(id);
        res.json(paymentIntent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Handle webhooks
app.post('/webhook', (req, res) => {
    const payload = req.body;
    const sig = req.headers['stripe-signature'];
    const endpointSecret = 'your_endpoint_secret'; // Replace with your webhook secret

    let event;
    try {
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('PaymentIntent was successful!', paymentIntent);
            break;
        // Other event types can be handled here
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

// Issue a refund
app.post('/refund', async (req, res) => {
    const { paymentIntentId } = req.body;
    try {
        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
        });
        res.json(refund);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Check payment status
app.get('/payment-status/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(id);
        res.json(paymentIntent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
