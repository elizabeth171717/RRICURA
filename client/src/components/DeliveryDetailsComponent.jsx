import { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { debounce } from "lodash";

const LOCATIONIQ_API_KEY = "pk.8570160733c4312003964837baa68a2a";

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Radius of Earth in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in miles
}

function DeliveryDetailsComponent({ onDeliveryDetailsSubmit }) {
  const [street, setStreet] = useState("");
  const [apt, setApt] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState("");

  const minDeliveryDate = new Date();
  minDeliveryDate.setDate(minDeliveryDate.getDate() + 2);

  // Skip Sundays
  while (minDeliveryDate.getDay() === 0) {
    minDeliveryDate.setDate(minDeliveryDate.getDate() + 1);
  }

  const formattedMinDate = minDeliveryDate.toISOString().split("T")[0];
  const prevDistance = useRef(null);

  const fetchLocation = useCallback(
    debounce(() => {
      if (street && city && state && zip) {
        const address = `${street} ${apt}, ${city}, ${state} ${zip}`;
        axios
          .get(
            `https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(
              address
            )}&format=json`
          )
          .then((response) => {
            if (response.data && response.data[0]) {
              const { lat, lon } = response.data[0];
              const businessLat = 33.8607;
              const businessLon = -84.3202;
              const calculatedDistance = calculateDistance(
                lat,
                lon,
                businessLat,
                businessLon
              );
              setDistance(calculatedDistance);
              setError("");
            } else {
              setError("Unable to find address, please check the details.");
            }
          })
          .catch((err) => {
            if (err.response && err.response.status === 429) {
              setError("Too many requests. Please wait and try again.");
            } else {
              setError("Error fetching address data.");
            }
            console.error(err);
          });
      }
    }, 1000),
    [street, apt, city, state, zip]
  );

  useEffect(() => {
    fetchLocation();
    return () => fetchLocation.cancel();
  }, [fetchLocation]);

  useEffect(() => {
    if (distance !== null && distance !== prevDistance.current) {
      onDeliveryDetailsSubmit({
        address: { street, apt, city, state, zip },
        date,
        time,
        distance,
      });
      prevDistance.current = distance;
    }
  }, [distance, date, time, onDeliveryDetailsSubmit]);

  return (
    <div className="delivery-details">
      <h2>Enter Delivery Details</h2>
      <form>
        <label>Street Number & Name:</label>
        <input
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          required
        />

        <label>Apt Number (if applicable):</label>
        <input value={apt} onChange={(e) => setApt(e.target.value)} />

        <label>City:</label>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />

        <label>State:</label>
        <input
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        />

        <label>Zip Code:</label>
        <input value={zip} onChange={(e) => setZip(e.target.value)} required />

        <label>Delivery Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={formattedMinDate}
          required
        />

        <label>Delivery Time:</label>
        <select value={time} onChange={(e) => setTime(e.target.value)} required>
          <option value="" disabled>
            Select time
          </option>
          <option value="08:00">8:00 AM</option>
          <option value="09:00">9:00 AM</option>
          <option value="10:00">10:00 AM</option>
          <option value="11:00">11:00 AM</option>
          <option value="12:00">12:00 PM</option>
          <option value="13:00">1:00 PM</option>
          <option value="14:00">2:00 PM</option>
          <option value="15:00">3:00 PM</option>
          <option value="16:00">4:00 PM</option>
          <option value="17:00">5:00 PM</option>
          <option value="18:00">6:00 PM</option>
          <option value="19:00">7:00 PM</option>
          <option value="20:00">8:00 PM</option>
          <option value="21:00">9:00 PM</option>
        </select>

        {distance !== null && (
          <p>Calculated Distance: {distance.toFixed(2)} miles</p>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}

DeliveryDetailsComponent.propTypes = {
  onDeliveryDetailsSubmit: PropTypes.func.isRequired,
};

export default DeliveryDetailsComponent;
