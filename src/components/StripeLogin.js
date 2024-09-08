import React from "react";
import axios from "axios";

const StripeLogin = () => {
  const handleStripeLogin = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/stripe-oauth-url"
      );
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error getting Stripe OAuth URL:", error);
    }
  };

  return <button onClick={handleStripeLogin}>Login with Stripe</button>;
};

export default StripeLogin;
