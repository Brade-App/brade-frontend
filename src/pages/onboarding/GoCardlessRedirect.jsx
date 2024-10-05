import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import LoadingPage from "../../components/LoadingPage";

const GoCardlessRedirect = () => {
  const location = useLocation();

  useEffect(() => {
    const handleRedirect = async () => {
      const requisitionId = localStorage.getItem("requisistion_id");
      if (requisitionId) {
        try {
          const response = await axios.post(
            "/api/gocardless/record-bank-transactions",
            {
              id: localStorage.getItem("id"),
              requisition_id: requisitionId,
            }
          );
          localStorage.removeItem("requisistion_id");
          window.opener.postMessage(
            { type: "GOCARDLESS_CONNECT_SUCCESS" },
            "*"
          );
        } catch (error) {
          console.error("Error handling GoCardless redirect:", error);
          window.opener.postMessage({ type: "GOCARDLESS_CONNECT_ERROR" }, "*");
        }
      } else {
        window.opener.postMessage({ type: "GOCARDLESS_CONNECT_ERROR" }, "*");
      }
      window.close();
    };

    handleRedirect();
  }, [location]);

  return <LoadingPage />;
};

export default GoCardlessRedirect;
