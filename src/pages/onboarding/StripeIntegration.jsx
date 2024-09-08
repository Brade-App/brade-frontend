import React from "react";
import { useNavigate } from "react-router-dom";
import PlaidLink from "../../components/PlaidLink";

const StripeIntegration = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          height: "400px",
          padding: "20px",
          backgroundColor: "#F2F2F2",
          borderRadius: "8px",
          border: "1px solid #efefef",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2
            style={{
              textAlign: "center",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "18px",
              color: "#222222",
              marginBottom: "20px",
            }}
          >
            Stripe & Account Integration
          </h2>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                maxWidth: "240px",
              }}
            >
              <img
                src="/images/logobrade.png"
                alt="Brade Logo"
                style={{ width: "80px", height: "80px", objectFit: "contain" }}
              />
              <img
                src="/images/link.png"
                alt="Link Logo"
                style={{ width: "50px", height: "auto" }}
              />
              <img
                src="/images/logostripe.png"
                alt="Stripe Logo"
                style={{ width: "80px", height: "80px", objectFit: "contain" }}
              />
            </div>
          </div>
          <p
            style={{
              textAlign: "center",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              color: "#5C5C5C",
              marginBottom: "30px",
            }}
          >
            Link your <span style={{ color: "#F564A9" }}>Stripe</span> and{" "}
            <span style={{ color: "#F564A9" }}>Business bank accounts</span>{" "}
            <br /> to start tracking revenue and costs <br /> effortlessly.
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={() => navigate("/account-created-success")}
            style={{
              width: "48%",
              height: "50px",
              backgroundColor: "#5c5c5c",
              color: "#f2f2f2",
              border: "none",
              borderRadius: "100px",
              cursor: "pointer",
              fontSize: "16px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
            }}
          >
            Skip
          </button>
          <button
            onClick={() => {
              /* Add connect functionality here */
            }}
            style={{
              width: "48%",
              height: "50px",
              backgroundColor: "#f564a9",
              color: "white",
              border: "none",
              borderRadius: "100px",
              cursor: "pointer",
              fontSize: "16px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
            }}
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default StripeIntegration;
