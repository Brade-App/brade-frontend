import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import LoadingPage from "../../components/LoadingPage";

const SumUpRedirect = () => {
  const location = useLocation();

  useEffect(() => {
    const handleRedirect = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");

      if (code && state === "2cFCsY36y95lFHk4") {
        try {
          const response = await axios.post(
            "/api/sumup/record-sumup-transactions",
            {
              id: localStorage.getItem("id"),
              code: code,
            }
          );
          window.opener.postMessage({ type: "SUMUP_CONNECT_SUCCESS" }, "*");
        } catch (error) {
          console.error("Error handling SumUp redirect:", error);
          window.opener.postMessage({ type: "SUMUP_CONNECT_ERROR" }, "*");
        }
      } else {
        window.opener.postMessage({ type: "SUMUP_CONNECT_ERROR" }, "*");
      }
      window.close();
    };

    handleRedirect();
  }, [location]);

  return <LoadingPage />;
};

export default SumUpRedirect;
