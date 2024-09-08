import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const SumUpCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");

      console.log("code", code);
      console.log("state", state);

      if (code && state === "2cFCsY36y95lFHk4") {
        try {
          console.log("SumUp authorization code:", code);
          navigate(`/transactions?code=${encodeURIComponent(code)}`);
        } catch (error) {
          console.error("Error connecting SumUp account:", error);
          setError("Failed to connect SumUp account. Please try again.");
        }
      } else {
        setError(
          "Invalid authorization response. Please try logging in again."
        );
      }
      setLoading(false);
    };

    handleCallback();
  }, [location, navigate]);

  if (loading) return <div>Connecting your SumUp account...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>SumUp Account Connected</h1>
      <p>Redirecting to transaction history...</p>
    </div>
  );
};

export default SumUpCallback;
