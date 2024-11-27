import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DeliveryDetailsComponent from "../components/DeliveryDetailsComponent";
import TipSection from "../components/TipSection";
import { useNavigate, Link } from "react-router-dom";

function CheckoutPage({ cart, subtotal }) {
  const [deliveryDetails, setDeliveryDetails] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [tip, setTip] = useState(0);
  const [tax, setTax] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);

  const navigate = useNavigate();

  // Calculate tax based on subtotal
  useEffect(() => {
    setTax(subtotal * 0.08); // 8% tax rate
  }, [subtotal]);

  const handleDeliveryDetailsSubmit = (details) => {
    setDeliveryDetails(details);
    updateDeliveryFee(details.distance);
  };

  const updateDeliveryFee = (distance) => {
    if (distance <= 7) setDeliveryFee(5);
    else if (distance > 7 && distance <= 12) setDeliveryFee(10);
    else setDeliveryFee("Out of range");
  };

  const handleSubmit = () => {
    if (!deliveryDetails || deliveryFee === "Out of range") {
      alert("Please confirm delivery details within the service area.");
      return;
    }

    const total = subtotal + deliveryFee + tax + tip; // Ensure tip is added here
    navigate("/payment", { state: { total } }); // Pass the correct total
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      {cart.length > 0 && (
        <Link to="/order" className="continue-shopping-link">
          Continue Shopping
        </Link>
      )}
      <DeliveryDetailsComponent
        onDeliveryDetailsSubmit={handleDeliveryDetailsSubmit}
      />

      <div className="order-summary">
        <h2>Order Summary</h2>
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              {item.quantity / 6} orders {item.name} - $
              {((item.price * item.quantity) / 6).toFixed(2)}
            </li>
          ))}
        </ul>
        <p>Subtotal: ${subtotal.toFixed(2)}</p>

        <label>Promo Code:</label>
        <input
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          placeholder="Enter promo code"
        />

        {/* Tip Section */}
        <TipSection subtotal={subtotal} onTipChange={setTip} />

        <p>
          Delivery Fee:{" "}
          {deliveryFee !== "Out of range"
            ? `$${deliveryFee.toFixed(2)}`
            : "Out of range"}
        </p>
        <p>Tax: ${tax.toFixed(2)}</p>

        <h3>
          Total: ${" "}
          {(
            subtotal +
            (deliveryFee !== "Out of range" ? deliveryFee : 0) +
            tax +
            tip
          ).toFixed(2)}
        </h3>
      </div>

      <button onClick={handleSubmit} className="checkout-button">
        Proceed to Payment
      </button>
    </div>
  );
}

CheckoutPage.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  subtotal: PropTypes.number.isRequired,
};

export default CheckoutPage;
