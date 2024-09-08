import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi";

const PasswordReset = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0].focus();
  }, []);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.value !== "") {
      if (index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    try {
      // Implement your OTP verification logic here
      console.log("OTP verification for:", email, "OTP:", otpString);
      // Navigate to the SetNewPassword page
      navigate("/set-new-password", { state: { email } });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("An error occurred. Please try again.");
    }
  };

  const handleResendCode = () => {
    // Implement resend code logic here
    console.log("Resend code for:", email);
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
          Password Reset
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
          We've sent an OTP code to {email}
        </p>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            {otp.map((data, index) => {
              return (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  ref={(el) => (inputRefs.current[index] = el)}
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  style={{
                    width: "40px",
                    height: "40px",
                    textAlign: "center",
                    fontSize: "24px",
                    border: "1px solid #efefef",
                    borderRadius: "4px",
                    backgroundColor: "#f2f2f2",
                  }}
                />
              );
            })}
          </div>
          <p
            style={{
              textAlign: "center",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              color: "#606060",
              marginBottom: "20px",
            }}
          >
            Didn't get any code?{" "}
            <span
              onClick={handleResendCode}
              style={{
                color: "#f564a9",
                cursor: "pointer",
              }}
            >
              Resend code
            </span>
          </p>
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
              Verify OTP
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

export default PasswordReset;
