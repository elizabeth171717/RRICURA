import { useState } from "react";
import PropTypes from "prop-types";

function TipSection({ subtotal, onTipChange }) {
  const [selectedTip, setSelectedTip] = useState(null);
  const [customTip, setCustomTip] = useState("");

  // Helper function to calculate tip based on percentage
  const calculateTipAmount = (percentage) => (subtotal * percentage) / 100;

  // Handle percentage tip selection
  const handleTipSelect = (percentage) => {
    setSelectedTip(percentage);
    setCustomTip("");
    onTipChange(calculateTipAmount(percentage));
  };

  // Handle custom tip input
  const handleCustomTipChange = (e) => {
    const value = e.target.value;
    setCustomTip(value);
    setSelectedTip(null);

    // Update the tip only if the input is a valid number
    const customAmount = parseFloat(value);
    if (!isNaN(customAmount)) {
      onTipChange(customAmount);
    }
  };

  return (
    <div className="tip-section">
      <h3>Choose a Tip Amount</h3>
      <div className="preset-tips">
        <button
          onClick={() => handleTipSelect(10)}
          className={selectedTip === 10 ? "selected" : ""}
        >
          10% (${calculateTipAmount(10).toFixed(2)})
        </button>
        <button
          onClick={() => handleTipSelect(15)}
          className={selectedTip === 15 ? "selected" : ""}
        >
          15% (${calculateTipAmount(15).toFixed(2)})
        </button>
        <button
          onClick={() => handleTipSelect(18)}
          className={selectedTip === 18 ? "selected" : ""}
        >
          18% (${calculateTipAmount(18).toFixed(2)})
        </button>
      </div>

      <div className="custom-tip">
        <label>Enter Custom Tip:</label>
        <input
          type="number"
          placeholder="Enter amount"
          value={customTip}
          onChange={handleCustomTipChange}
          min="0"
          step="0.01"
        />
      </div>
    </div>
  );
}

TipSection.propTypes = {
  subtotal: PropTypes.number.isRequired,
  onTipChange: PropTypes.func.isRequired,
};

export default TipSection;
