import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AccountCreatedSuccessly = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/main-menu"); // Replace "/main-menu" with the actual path to your main menu page
    }, 3500); // 3.5 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

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
      </div>
    </div>
  );
};

export default AccountCreatedSuccessly;
