// src/pages/TamaleDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function TamaleDetailPage({ tamales, addToCart, cart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const tamale = tamales.find((t) => t.id === parseInt(id, 10));

  // Set default quantity based on cart or default to 6
  const initialQuantity =
    cart.find((item) => item.id === tamale?.id)?.quantity || 6;
  const [quantity, setQuantity] = useState(initialQuantity);
  const [popup, setPopup] = useState({ isVisible: false, message: "" });

  // Adjusted total price based on quantity
  const totalPrice = tamale ? (tamale.price * quantity) / 6 : 0;

  // Handle quantity change in multiples of 6
  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value, 10));
  };

  // Handle add to cart
  const handleAddToCart = () => {
    addToCart({ ...tamale, quantity });
    setPopup({ isVisible: true, message: `${tamale.name} added to cart!` });
  };

  // Close popup after 3 seconds if it is visible
  useEffect(() => {
    if (popup.isVisible) {
      const timer = setTimeout(() => {
        setPopup({ isVisible: false, message: "" });
      }, 3000);
      return () => clearTimeout(timer); // Clear timeout on cleanup
    }
  }, [popup.isVisible]);

  if (!tamale) {
    return (
      <p>
        Tamale not found! <button onClick={() => navigate(-1)}>Go Back</button>
      </p>
    );
  }

  return (
    <div className="tamale-detail-page">
      <img src={tamale.image} alt={`${tamale.name}`} />
      <h1>{tamale.name}</h1>
      <p>{tamale.description}</p>
      <p>Price per 6: ${tamale.price}</p>
      <p>
        Total Price for {quantity}: ${totalPrice.toFixed(2)}
      </p>

      {/* Quantity Selector */}
      <div className="quantity-selector">
        <label htmlFor="quantity">Quantity: </label>
        <select id="quantity" value={quantity} onChange={handleQuantityChange}>
          <option value={6}>6</option>
          <option value={12}>12</option>
          <option value={18}>18</option>
          <option value={24}>24</option>
          <option value={30}>30</option>
          <option value={36}>36</option>
        </select>
      </div>

      {/* Add to Cart Button */}
      <button onClick={handleAddToCart}>Add to Cart</button>

      {/* Share Button */}
      <button
        onClick={() => {
          if (navigator.share) {
            navigator
              .share({
                title: tamale.name,
                text: tamale.description,
                url: window.location.href,
              })
              .catch((error) => console.log("Error sharing:", error));
          } else {
            alert("Sharing not supported on this browser.");
          }
        }}
      >
        Share
      </button>

      {/* Popup for confirmation */}
      {popup.isVisible && (
        <div className="popup">
          <p>{popup.message}</p>
          <button onClick={() => navigate("/cart")}>View Cart</button>
        </div>
      )}
    </div>
  );
}

// Prop validation
TamaleDetailPage.propTypes = {
  tamales: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
  addToCart: PropTypes.func.isRequired,
  cart: PropTypes.array.isRequired,
};

export default TamaleDetailPage;
