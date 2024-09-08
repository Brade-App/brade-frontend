import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const GoCardlessCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const redirectFlowId = urlParams.get("redirect_flow_id");

      if (redirectFlowId) {
        try {
          const response = await axios.post(
            "http://localhost:5000/api/gocardless-callback",
            { redirect_flow_id: redirectFlowId }
          );
          console.log("GoCardless connection successful:", response.data);
          navigate("/bank-accounts");
        } catch (error) {
          console.error("Error connecting GoCardless account:", error);
          setError("Failed to connect GoCardless account. Please try again.");
        }
      } else {
        setError("No redirect flow ID found. Please try logging in again.");
      }
      setLoading(false);
    };

    handleCallback();
  }, [location, navigate]);

  if (loading) {
    return <div>Connecting your GoCardless account...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>GoCardless Account Connected</h1>
      <p>Redirecting to transaction history...</p>
    </div>
  );
};

export default GoCardlessCallback;
