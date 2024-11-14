import { useEffect } from "react";
import PropTypes from "prop-types";

function Popup({ message, onClose, viewCartLink }) {
  useEffect(() => {
    // Set a timer to automatically close the popup after 3 seconds
    const timer = setTimeout(onClose, 3000);

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="popup">
      <p>{message}</p>
      <a href={viewCartLink}>View Cart</a>
    </div>
  );
}

// Prop validation
Popup.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  viewCartLink: PropTypes.string.isRequired,
};

export default Popup;
