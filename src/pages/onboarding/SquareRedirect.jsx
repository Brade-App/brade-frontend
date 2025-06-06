import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import LoadingPage from "../../components/LoadingPage";

const SquareRedirect = () => {
  const location = useLocation();

  useEffect(() => {
    const handleRedirect = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get("code");
      if (code) {
        try {
          const response = await axios.post(
            "/api/square/record-square-transactions",
            {
              id: localStorage.getItem("id"),
              code: code,
            }
          );
          window.opener.postMessage({ type: "SQUARE_CONNECT_SUCCESS" }, "*");
        } catch (error) {
          console.error("Error handling Square redirect:", error);
          window.opener.postMessage({ type: "SQUARE_CONNECT_ERROR" }, "*");
        }
      } else {
        window.opener.postMessage({ type: "SQUARE_CONNECT_ERROR" }, "*");
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

export default SquareRedirect;
