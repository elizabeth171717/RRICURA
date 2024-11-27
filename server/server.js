import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' }); // Ensure this file exists in the same directory
console.log("Loaded STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY || "NOT LOADED");

const app = express();
const PORT = 5001;

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(
    cors({
        origin: [/^http:\/\/localhost:\d+$/], // Allow any localhost port for development
        methods: ["GET", "POST"],
    })
);

app.use(express.json());

// Endpoint to create a PaymentIntent
app.post("/api/create-payment-intent", async (req, res) => {
    const { amount } = req.body; // Amount in cents (e.g., $10.00 = 1000)

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Stripe API Error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
