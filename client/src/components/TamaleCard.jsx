import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "../App.css";

function TamaleCard({ id, name, description, price, image, onAddToCart }) {
  const [quantity, setQuantity] = useState(6); // Starts at 6 per order

  // Calculate the total price based on the quantity
  const totalPrice = price * (quantity / 6);

  const handleQuantityChange = (increment) => {
    setQuantity((prev) => Math.max(6, prev + increment)); // Adjust in multiples of 6
  };

  const handleAddToCart = () => {
    // Ensure all tamale properties are passed to onAddToCart
    onAddToCart({
      id,
      name,
      description,
      image,
      quantity,
      price: totalPrice,
    });
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/tamales/${id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("Link copied to clipboard! You can now share it.");
    });
  };

  return (
    <div className="tamale-card">
      <Link to={`/tamales/${id}`} className="tamale-card-link">
        <img src={image} alt={`${name}`} className="tamale-image" />
      </Link>
      <h3>{name}</h3>
      <p>{description}</p>
      <p>Price per 6: ${price}</p>
      <p>Total Price: ${totalPrice.toFixed(2)}</p>

      <div className="quantity-selector">
        <button
          onClick={() => handleQuantityChange(-6)}
          disabled={quantity <= 6}
        >
          -
        </button>
        <span>{quantity}</span>
        <button onClick={() => handleQuantityChange(6)}>+</button>
      </div>
      <button onClick={handleAddToCart} className="add-to-cart-button">
        Add to Cart
      </button>
      <button onClick={handleShare} className="share-button">
        Share
      </button>
    </div>
  );
}

// Prop validation
TamaleCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default TamaleCard;
