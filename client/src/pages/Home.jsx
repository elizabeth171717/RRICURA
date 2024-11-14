import "react";

function Home() {
  return (
    <div className="home">
      <h1>Welcome to Rricura Tamales Mexicanos!</h1>
      <p>
        We make authentic Mexican tamales delivered straight to your door in
        Brookhaven, GA.
      </p>
      <p>
        Explore our menu and preorder your tamales for a delicious experience!
      </p>
      <button
        onClick={() => (window.location.href = "/order")}
        className="order-button"
      >
        Order Now
      </button>
    </div>
  );
}

export default Home;
