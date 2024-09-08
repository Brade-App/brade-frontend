import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/FormInput";
import { HiOutlineArrowLeft } from "react-icons/hi";
import axios from "axios";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // API call to request password reset and send OTP
      const response = await axios.post("/api/request_password_reset", {
        email,
      });

      if (response.data.id) {
        console.log("Password reset OTP sent for:", email);
        // Navigate to the PasswordReset page
        navigate("/password-reset", { state: { email } });
      } else {
        setError(
          response.data.message || "Failed to send OTP. Please try again."
        );
      }
    } catch (error) {
      console.error("Error requesting password reset:", error);
      setError("An error occurred. Please try again.");
    }
  };

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
      <div style={{ width: "100%", maxWidth: "400px", padding: "20px" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src="/images/logoblack.png"
            alt="Company Logo"
            style={{ width: "100px", height: "auto" }}
          />
        </div>
        <h2
          style={{
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "24px",
            color: "#222222",
          }}
        >
          Forgot Password
        </h2>
        <p
          style={{
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            color: "#5C5C5C",
            marginBottom: "20px",
          }}
        >
          No worries, we'll send you reset instructions.
        </p>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        {success && (
          <p style={{ color: "green", textAlign: "center" }}>{success}</p>
        )}
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <FormInput
            label="Email"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            hint="name@email.com"
          />
          <div style={{ width: "100%", marginTop: "20px" }}>
            <button
              type="submit"
              style={{
                width: "100%",
                height: "52px",
                backgroundColor: "#f564a9",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Reset Password
            </button>
          </div>
        </form>
        <p style={{ marginTop: "20px", textAlign: "center" }}>
          <span
            onClick={() => navigate("/login")}
            style={{
              color: "#5c5c5c",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "14px",
              fontFamily: "Inter, sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HiOutlineArrowLeft style={{ marginRight: "8px" }} />
            Back to Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default ForgetPassword;
