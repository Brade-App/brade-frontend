import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import LoadingPage from "../../components/LoadingPage";

const StripeRedirect = () => {
  const location = useLocation();

  useEffect(() => {
    const handleRedirect = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get("code");
      if (code) {
        try {
          const response = await axios.post(
            "/api/stripe/record-stripe-transactions",
            {
              id: localStorage.getItem("id"),
              code: code,
            }
          );
          if (window.opener && window.opener.postMessage) {
            window.opener.postMessage({ type: "STRIPE_CONNECT_SUCCESS" }, "*");
          } else {
            console.log(
              "Stripe connection successful, but unable to communicate with opener."
            );
          }
        } catch (error) {
          console.error("Error handling Stripe redirect:", error);
          if (window.opener && window.opener.postMessage) {
            window.opener.postMessage({ type: "STRIPE_CONNECT_ERROR" }, "*");
          } else {
            console.log(
              "Stripe connection failed, and unable to communicate with opener."
            );
          }
        }
      } else {
        if (window.opener && window.opener.postMessage) {
          window.opener.postMessage({ type: "STRIPE_CONNECT_ERROR" }, "*");
        } else {
          console.log(
            "No code received, and unable to communicate with opener."
          );
        }
      }
      window.close();
    };

    handleRedirect();
  }, [location]);

  return (
    <div style={{ height: "100vh" }}>
      <LoadingPage />
    </div>
  );
};

export default StripeRedirect;
