// src/pages/CartPage.jsx
import "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";

function CartPage({ cart, updateCartItem, removeCartItem }) {
  // Calculate subtotal (only products, no fees yet)
  const subtotal = cart.reduce(
    (sum, item) => sum + (item.price * item.quantity) / 6,
    0
  );

  const navigate = useNavigate();

  const handleCheckout = () => {
    // Navigate to CheckoutPage when user clicks "Checkout"
    navigate("/checkout");
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {cart.length > 0 && <Link to="/order">Continue Shopping</Link>}
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>Price per 6: ${item.price}</p>
                  <div className="quantity-selector">
                    <button
                      onClick={() => updateCartItem(item.id, item.quantity - 6)}
                      disabled={item.quantity <= 6}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateCartItem(item.id, item.quantity + 6)}
                    >
                      +
                    </button>
                  </div>
                  <p>
                    Subtotal: ${((item.price * item.quantity) / 6).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeCartItem(item.id)}
                  className="remove-button"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="order-summary">
            <h2>Order Summary</h2>
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
          </div>
          <button onClick={handleCheckout} className="checkout-button">
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}

CartPage.propTypes = {
  cart: PropTypes.array.isRequired,
  updateCartItem: PropTypes.func.isRequired,
  removeCartItem: PropTypes.func.isRequired,
};

export default CartPage;
