import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import LoadingPage from "../../components/LoadingPage";

const AccountCreatedSuccessly = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const authorizationProcessed = useRef(false);

  useEffect(() => {
    const handleAuthorization = async () => {
      if (authorizationProcessed.current) return;
      authorizationProcessed.current = true;

      const urlParams = new URLSearchParams(location.search);
      const authorization_code = urlParams.get("code");

      if (authorization_code) {
        try {
          const response = await axios.post("/api/stripe/get_access_token", {
            code: authorization_code,
          });
          // You might want to store some data from the response in localStorage or context
        } catch (error) {
          console.error("Error connecting Stripe account:", error);
          setError("Failed to connect Stripe account. Please try again.");
        }
      }

      setIsLoading(false);

      // Set a timeout to navigate after showing the success message
      setTimeout(() => {
        navigate("/main-menu"); // Replace "/main-menu" with the actual path to your main menu page
      }, 3500); // 3.5 seconds
    };

    handleAuthorization();
  }, [location, navigate]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#fcfcfc",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          padding: "40px",
          textAlign: "center",
        }}
      >
        <img
          src="/images/success.png"
          alt="Success"
          style={{
            width: "80px",
            height: "80px",
          }}
        />
        <h2
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "26px",
            color: "#222222",
          }}
        >
          Account Created Successfully!✨
        </h2>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            fontWeight: 500,
            color: "#5C5C5C",
            marginBottom: "30px",
          }}
        >
          You will be redirected to your dashboard shortly.
        </p>
        {error && (
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              color: "red",
              marginTop: "10px",
            }}
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default AccountCreatedSuccessly;
