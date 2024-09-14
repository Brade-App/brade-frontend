import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const StripeCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStripeToken = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get("code");

      if (code) {
        try {
          const response = await axios.post("/api/stripe-callback", { code });
          console.log("Stripe connection successful:", response.data);
          navigate("/transactions");
        } catch (error) {
          console.error("Error connecting Stripe account:", error);
          setError("Failed to connect Stripe account. Please try again.");
        }
      } else {
        setError("No authorization code found. Please try logging in again.");
      }
      setLoading(false);
    };

    fetchStripeToken();
  }, [location, navigate]);

  if (loading) {
    return <div>Connecting your Stripe account...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Stripe Account Connected</h1>
      <p>Redirecting to transaction history...</p>
    </div>
  );
};

export default StripeCallback;
