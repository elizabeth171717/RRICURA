import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';

const app = express();
const PORT = 5001;

// Initialize Stripe with your secret key
const stripe = new Stripe('sk_test_51QBgjIEfaZC1SjSN59Hb5KV16SqZZFetnxmEllxK84ZQRYj7RlprC2RkK5yT30KI5oz7FCI4wLaewlprE0Qbh26v00XZXsYoCH'); // Replace with your Stripe secret key

app.use(cors({ origin: "http://localhost:5173" })); // Replace with your frontend's port if different


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
        console.error("Error creating PaymentIntent:", error);
        res.status(500).json({ error: error.message });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
