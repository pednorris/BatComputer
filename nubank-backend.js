// nubank-backend.js

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const NUBANK_API_URL = 'https://api.nubank.com.br';

// Charge creation
app.post('/create-charge', async (req, res) => {
    try {
        const { amount, description } = req.body;
        const response = await axios.post(`${NUBANK_API_URL}/charges`, { amount, description });
        res.status(201).json(response.data);
    } catch (error) {
        console.error('Error creating charge:', error);
        res.status(500).json({ error: 'Error creating charge' });
    }
});

// Webhook handling
app.post('/webhook', (req, res) => {
    const event = req.body;
    // Process the webhook event according to your business logic
    console.log('Webhook event received:', event);
    res.status(200).send('Webhook received!');
});

// Payment verification
app.get('/verify-payment/:chargeId', async (req, res) => {
    try {
        const { chargeId } = req.params;
        const response = await axios.get(`${NUBANK_API_URL}/charges/${chargeId}`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ error: 'Error verifying payment' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
