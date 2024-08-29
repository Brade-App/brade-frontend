import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51Pss5sE8HG8J7WaxVbaU8aPP5MVHFLWR0XxyUQs0PjVcW7vIxOcVz8NrS5JlbzD1SiDGhE40SZ1kNOEeq934qlcT002uEoVxZN"
);

const StripeFinancialConnect = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleConnect = async () => {
    try {
      setError("");
      console.log("Creating customer...");
      const customerResponse = await axios.post(
        "http://localhost:5000/api/create-customer",
        { email, name }
      );
      const customerId = customerResponse.data.customer_id;
      console.log("Customer created:", customerId);

      console.log("Creating financial connection session...");
      const response = await axios.post(
        "http://localhost:5000/api/create-financial-connection-session",
        { customer_id: customerId }
      );
      const { client_secret, session_id } = response.data;
      console.log("Session created:", session_id);

      const stripe = await stripePromise;
      const { error } = await stripe.collectFinancialConnectionsAccounts({
        clientSecret: client_secret,
      });

      if (error) {
        console.error("Error:", error);
        setError("An error occurred. Please try again.");
      } else {
        navigate("/success", { state: { session_id } });
      }
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <h1>Connect Your Bank Account</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <button onClick={handleConnect}>Connect Bank Account</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default StripeFinancialConnect;
