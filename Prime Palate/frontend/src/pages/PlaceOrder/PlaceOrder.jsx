import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./PlaceOrder.css";
import { deliveryFee } from "../Cart/Cart";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();

  // ✅ ADD THIS FUNCTION (missing tha)
  const handlePayment = async (e) => {
    e.preventDefault();

    const amount =
      getTotalCartAmount() === 0
        ? 0
        : getTotalCartAmount() + deliveryFee;

    try {
      const response = await fetch("http://localhost:5000/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();
      console.log("Order created:", data);
const order = data;   //  THIS IS THE FIX
      const options = {
        key: "", //  apni Razorpay key daalo
        amount: order.amount,
        currency: "INR",
        name: "Food Delivery App",
        description: "Order Payment",
        order_id: order.id,

        handler: function (response) {
          alert("Payment Successful ");
          navigate("/success"); // optional
        },

        theme: {
          color: "#A0522D",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.log(err);
      alert("Payment failed ❌");
    }
  };

  return (
    <>
      <button className="GoBack" onClick={() => navigate("/cart")}>
        ⬅️Go Back to Cart Page
      </button>

      <form className="place-order">
        <div className="place-order-left">
          <h2 className="title">Delivery Information</h2>

          <div className="multi-fields">
            <input type="text" placeholder="First Name" />
            <input type="text" placeholder="Last Name" />
          </div>

          <input type="email" placeholder="Email Address" />
          <input type="text" placeholder="Street" />

          <div className="multi-fields">
            <input type="text" placeholder="City" />
            <input type="text" placeholder="State" />
          </div>

          <div className="multi-fields">
            <input type="number" placeholder="Zip Code" />
            <input type="text" placeholder="Country" />
          </div>

          <input type="number" placeholder="Phone" />
        </div>

        <div className="place-order-right">
          <div className="cart-total">
            <h2 className="title">Cart Total</h2>

            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>Rs{getTotalCartAmount()}</p>
              </div>

              <hr />

              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>Rs{getTotalCartAmount() === 0 ? 0 : deliveryFee}</p>
              </div>

              <hr />

              <div className="cart-total-details">
                <b>Total</b>
                <b>
                  Rs
                  {getTotalCartAmount() === 0
                    ? 0
                    : getTotalCartAmount() + deliveryFee}
                </b>
              </div>
            </div>

            {/* ✅ IMPORTANT FIX */}
            <button
              type="button"
              disabled={getTotalCartAmount() === 0}
              onClick={handlePayment}
            >
              PROCEED TO CHECKOUT
            </button>

          </div>
        </div>
      </form>
    </>
  );
};

export default PlaceOrder;