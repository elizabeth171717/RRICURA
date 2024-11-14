// OrderPage.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TamaleCard from "../components/TamaleCard";
import Popup from "../components/Popup"; // Import Popup component

function OrderPage({ addToCart, tamales }) {
  const [popup, setPopup] = useState({ isVisible: false, message: "" });

  const handleAddToCart = (tamale) => {
    const itemToAdd = {
      id: tamale.id,
      name: tamale.name,
      description: tamale.description,
      price: tamale.price,
      image: tamale.image,
      quantity: 6,
    };

    addToCart(itemToAdd);
    setPopup({ isVisible: true, message: `${tamale.name} added to cart!` });
  };

  // Automatically close the popup after 3 seconds if it's visible
  useEffect(() => {
    if (popup.isVisible) {
      const timer = setTimeout(() => {
        setPopup({ isVisible: false, message: "" });
      }, 3000);

      return () => clearTimeout(timer); // Clear timeout on cleanup
    }
  }, [popup.isVisible]);

  return (
    <div className="order-page">
      <h1>Order Tamales</h1>
      <div className="tamale-list">
        {tamales.map((tamale) => (
          <TamaleCard
            key={tamale.id}
            id={tamale.id}
            name={tamale.name}
            description={tamale.description}
            price={tamale.price}
            image={tamale.image}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
      {popup.isVisible && (
        <Popup
          message={popup.message}
          onClose={() => setPopup({ isVisible: false, message: "" })}
          viewCartLink="/cart"
        />
      )}
    </div>
  );
}

OrderPage.propTypes = {
  addToCart: PropTypes.func.isRequired,
  tamales: PropTypes.array.isRequired,
};

export default OrderPage;
