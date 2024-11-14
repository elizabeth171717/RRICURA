// src/App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import OrderPage from "./pages/OrderPage";
import CartPage from "./pages/CartPage";
import TamaleDetailPage from "./components/TamaleDetailPage";
import CheckoutPage from "./pages/CheckoutPage"; // Import CheckoutPage
import PaymentPage from "./pages/PaymentPage"; // Import PaymentPage
import ThankYouPage from "./pages/ThankYouPage"; // Import ThankYouPage

function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Array of tamales
  const tamales = [
    {
      id: 1,
      name: "Chicken Tamales",
      description: "Traditional tamales with chicken",
      price: 24,
      image: "/images/chickentamale.jpg",
    },
    {
      id: 2,
      name: "Rajas Tamales",
      description: "Tamales with peppers and cheese",
      price: 24,
      image: "/images/rajastamale.jpg",
    },
    {
      id: 3,
      name: "Pork Tamales",
      description: "Spicy pork tamales",
      price: 24,
      image: "/images/pork.jpg",
    },
    {
      id: 4,
      name: "Sweet Tamales",
      description: "Sweet tamales for dessert",
      price: 18,
      image: "/images/sweettamle.png",
    },
    {
      id: 5,
      name: "Vegan Tamales",
      description: "Plant-based vegan tamales",
      price: 30,
      image: "/images/vegantamale.jpg",
    },
    {
      id: 6,
      name: "Fruit Tamales",
      description: "Fruity tamales with a hint of sweetness",
      price: 24,
      image: "/images/fruittamale.jpg",
    },
    {
      id: 7,
      name: "Banana Leaf Chicken Tamales",
      description: "Chicken tamales wrapped in banana leaf",
      price: 36,
      image: "/images/bananaleafchicken.jpg",
    },
    {
      id: 8,
      name: "Banana Leaf Pork Tamales",
      description: "Pork tamales wrapped in banana leaf",
      price: 36,
      image: "/images/babanaleafpork.jpg",
    },
  ];

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        )
      );
    } else {
      setCart([...cart, item]);
    }
  };

  const updateCartItem = (id, newQuantity) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeCartItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  return (
    <Router>
      <div>
        <Navbar cartCount={cart.length} />
        <Routes>
          <Route
            path="/"
            element={<div>Welcome to Rricura Tamales Mexicanos!</div>}
          />
          <Route
            path="/order"
            element={<OrderPage addToCart={addToCart} tamales={tamales} />}
          />
          <Route
            path="/cart"
            element={
              <CartPage
                cart={cart}
                updateCartItem={updateCartItem}
                removeCartItem={removeCartItem}
              />
            }
          />
          <Route
            path="/tamales/:id"
            element={
              <TamaleDetailPage
                tamales={tamales}
                addToCart={addToCart}
                cart={cart}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <CheckoutPage
                cart={cart}
                subtotal={cart.reduce(
                  (sum, item) => sum + (item.price * item.quantity) / 6,
                  0
                )}
              />
            }
          />

          <Route
            path="/payment"
            element={
              <PaymentPage
                total={cart.reduce(
                  (sum, item) => sum + (item.price * item.quantity) / 6,
                  0
                )}
              />
            }
          />
          <Route path="/thank-you" element={<ThankYouPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
