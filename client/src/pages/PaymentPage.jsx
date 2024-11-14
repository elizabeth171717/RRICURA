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

const stripePromise = loadStripe(
  "pk_test_51QBgjIEfaZC1SjSN6phqZUGTDxgkdqBItgYs34nzwSGu9UTzuNE83UbgfGEx3l4Tz13h6zlTRDxYBcugxci02zKP00yM0S9PA2"
);

function PaymentForm({ amount }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("http://localhost:5001/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amount * 100 }), // Convert dollars to cents
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to create Payment Intent.");
        }
        return res.json();
      })
      .then((data) => setClientSecret(data.clientSecret))
      .catch((error) => setErrorMessage(error.message));
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

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    } else if (paymentIntent.status === "succeeded") {
      console.log("Payment successful!", paymentIntent);

      // Clear the cart from local storage
      localStorage.removeItem("cart");

      // Redirect to Thank You page
      navigate("/thank-you");
      setErrorMessage("");
    } else {
      setErrorMessage("Payment did not complete.");
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
};

function PaymentPage({ total }) {
  return (
    <Elements stripe={stripePromise}>
      <h2>Payment</h2>
      <PaymentForm amount={total} />
    </Elements>
  );
}

PaymentPage.propTypes = {
  total: PropTypes.number.isRequired,
};

export default PaymentPage;
