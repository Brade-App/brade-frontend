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
          console.log(response.data);
          window.opener.postMessage({ type: "STRIPE_CONNECT_SUCCESS" }, "*");
        } catch (error) {
          console.error("Error handling Stripe redirect:", error);
          window.opener.postMessage({ type: "STRIPE_CONNECT_ERROR" }, "*");
        }
      } else {
        window.opener.postMessage({ type: "STRIPE_CONNECT_ERROR" }, "*");
      }
      window.close();
    };

    handleRedirect();
  }, [location]);

  return <LoadingPage />;
};

export default StripeRedirect;
