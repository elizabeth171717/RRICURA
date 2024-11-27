import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom"; // Ensure this is added

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function PaymentForm({ amount, clearCart }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    async function createPaymentIntent() {
      try {
        const response = await fetch(
          "http://localhost:5001/api/create-payment-intent",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: amount * 100 }), // Convert dollars to cents
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create Payment Intent.");
        }
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        setErrorMessage(error.message);
      }
    }
    createPaymentIntent();
  }, [amount]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    if (!clientSecret) {
      setErrorMessage("Payment could not be initiated.");
      setIsLoading(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        { payment_method: { card: cardElement } }
      );

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === "succeeded") {
        console.log("Payment successful!", paymentIntent);

        // Clear cart after payment
        clearCart(); // Call clearCart from props

        // Redirect to ThankYouPage
        navigate("/thank-you");
      } else {
        console.log("Payment status:", paymentIntent.status);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={{ style: { base: { fontSize: "18px" } } }} />
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <button type="submit" disabled={!stripe || isLoading}>
        {isLoading ? "Processing..." : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
}

PaymentForm.propTypes = {
  amount: PropTypes.number.isRequired,
  clearCart: PropTypes.func.isRequired,
};

function PaymentPage({ clearCart }) {
  const location = useLocation();
  const { total } = location.state || {}; // Ensure total is accessed

  if (total === undefined) {
    return <p>Error: Total not provided!</p>; // Error fallback if total is missing
  }

  return (
    <Elements stripe={stripePromise}>
      <h2>Payment</h2>
      <p>Total: ${total.toFixed(2)}</p> {/* Display the total correctly */}
      <PaymentForm amount={total} clearCart={clearCart} />{" "}
      {/* Pass total to PaymentForm */}
    </Elements>
  );
}

PaymentPage.propTypes = {
  total: PropTypes.number.isRequired,
  clearCart: PropTypes.func.isRequired,
};

export default PaymentPage;
