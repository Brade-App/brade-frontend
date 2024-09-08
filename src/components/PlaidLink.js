import React, { useState, useCallback } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StripeLogin from "./StripeLogin";

const PlaidLink = () => {
  const [linkToken, setLinkToken] = useState(null);
  const [sumUpHtml, setSumUpHtml] = useState(null);
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

  const handleGoCardlessLink = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/gocardless/choose-a-bank"
      );
      console.log(response.data.banks);
      navigate("/gocardless-banks", { state: { banks: response.data.banks } });
    } catch (error) {
      console.error("Error getting GoCardless banks:", error);
    }
  };

  const handleSumUpConnect = () => {
    const sumUpAuthUrl = new URL("https://api.sumup.com/authorize");
    sumUpAuthUrl.searchParams.append("response_type", "code");
    sumUpAuthUrl.searchParams.append(
      "client_id",
      "cc_classic_qqZlr2lRPFJqBnfS4oqD5cH6cDcwk"
    );
    sumUpAuthUrl.searchParams.append(
      "redirect_uri",
      "http://localhost:3000/sumup-callback"
    );
    sumUpAuthUrl.searchParams.append("scope", "transactions.history");
    sumUpAuthUrl.searchParams.append("state", "2cFCsY36y95lFHk4");

    window.location.href = sumUpAuthUrl.toString();
  };

  const closeSumUpModal = () => {
    setSumUpHtml(null);
  };

  return (
    <div>
      <h1>Connect Your Bank Account</h1>
      <button onClick={() => open()} disabled={!ready}>
        Connect a bank account with Plaid
      </button>
      <button onClick={() => navigate("/transactions")}>
        Go to Transactions (Test)
      </button>
      <button onClick={handleGoCardlessLink}>Connect with GoCardless</button>
      <button onClick={() => navigate("/bank-transactions")}>
        View Bank Transactions
      </button>
      <button onClick={handleSumUpConnect}>Connect SumUp Account</button>
      <StripeLogin />

      {sumUpHtml && (
        <div className="modal">
          <div className="modal-content">
            <button onClick={closeSumUpModal}>Close</button>
            <iframe
              srcDoc={sumUpHtml}
              style={{ width: "100%", height: "500px", border: "none" }}
              title="SumUp Authorization"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaidLink;
