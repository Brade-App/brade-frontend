import React, { useState, useCallback } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PlaidLink = () => {
  const [linkToken, setLinkToken] = useState(null);
  const navigate = useNavigate();

  const onSuccess = useCallback(
    async (public_token, metadata) => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/set_access_token",
          { public_token: public_token }
        );
        console.log("Access token set successfully");
        console.log("Attempting to navigate to /success");
        navigate("/transactions", {
          state: { session_id: metadata.session_id },
        });
      } catch (error) {
        console.error("Error setting access token:", error);
      }
    },
    [navigate]
  );

  const config = {
    token: linkToken,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  React.useEffect(() => {
    const createLinkToken = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/create_link_token"
        );
        setLinkToken(response.data.link_token);
      } catch (error) {
        console.error("Error creating link token:", error);
      }
    };
    createLinkToken();
  }, []);

  return (
    <div>
      <h1>Connect Your Bank Account</h1>
      <button onClick={() => open()} disabled={!ready}>
        Connect a bank account
      </button>
      <button onClick={() => navigate("/transactions")}>
        Go to Transactions (Test)
      </button>
    </div>
  );
};

export default PlaidLink;
