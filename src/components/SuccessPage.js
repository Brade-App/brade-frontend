import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const SuccessPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchSessionData = async () => {
      const sessionId = location.state?.session_id;
      console.log("Session ID:", sessionId);

      if (sessionId) {
        try {
          const response = await axios.get(
            `/api/get-account-id?session_id=${sessionId}`
          );
          const accountId = response.data.account_id;
          console.log("Account ID:", accountId);
          navigate("/transactions", { state: { accountId } });
        } catch (error) {
          console.error("Error retrieving account ID:", error);
          setError("Failed to retrieve account information. Please try again.");
          setLoading(false);
        }
      } else {
        setError(
          "No session ID found. Please try connecting your account again."
        );
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [navigate, location.state]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Connection Successful</h1>
      <p>Redirecting to transaction history...</p>
    </div>
  );
};

export default SuccessPage;
