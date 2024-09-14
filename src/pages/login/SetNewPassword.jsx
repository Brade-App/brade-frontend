import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import FormInput from "../../components/FormInput";
import { HiOutlineArrowLeft } from "react-icons/hi";

const RequirementBox = ({ met, text }) => (
  <div
    style={{
      display: "inline-block",
      marginRight: "10px",
      borderRadius: "100px",
      backgroundColor: met ? "#f564a9" : "#f2f2f2",
      color: met ? "white" : "#606060",
    }}
  >
    <span
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "12px",
        fontWeight: 500,
        whiteSpace: "nowrap",
        padding: "10px 14px",
      }}
    >
      {text}
    </span>
  </div>
);

const SetNewPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");

  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Extract tokens from the URL hash
    const hash = location.hash.substring(1); // Remove the '#' at the start
    const params = new URLSearchParams(hash);

    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    setAccessToken(access_token);
    setRefreshToken(refresh_token);

    // Reauthenticate user with the tokens
    const reauthenticateUser = async () => {
      try {
        const response = await axios.post("/api/reauthenticate", {
          access_token: access_token,
          refresh_token: refresh_token,
        });

        if (!response.error) {
          console.log("User reauthenticated successfully");
          // You might want to update the tokens here if the API returns new ones
          // setAccessToken(response.data.newAccessToken);
          // setRefreshToken(response.data.newRefreshToken);
        } else {
          console.error("Reauthentication failed");
          setError(
            "Authentication failed. Please try the password reset process again."
          );
          // Optionally, redirect the user back to the login or password reset request page
          navigate("/login");
        }
      } catch (error) {
        console.error("Error during reauthentication:", error);
        setError("An error occurred during authentication. Please try again.");
        // Optionally, redirect the user back to the login or password reset request page
        // navigate("/login");
      }
    };

    if (access_token && refresh_token) {
      reauthenticateUser();
    } else {
      setError(
        "Invalid authentication tokens. Please try the password reset process again."
      );
      // Optionally, redirect the user back to the login or password reset request page
      // navigate("/login");
    }
  }, [location, navigate]);

  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasValidLength, setHasValidLength] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (!(hasUpperCase && hasLowerCase && hasNumber && hasValidLength)) {
      setError("Password does not meet all requirements");
      return;
    }

    try {
      const response = await axios.post("/api/update_password", {
        password: password,
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (response.status === 200) {
        console.log("New password set successfully");
        setError(""); // Clear any existing errors
        // Display success message
        setSuccess("Password changed successfully.");
        // Navigate to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(
          response.data.error || "Failed to set new password. Please try again."
        );
      }
    } catch (error) {
      console.error("Error setting new password:", error);
      setError("An error occurred. Please try again.");
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setHasUpperCase(/[A-Z]/.test(newPassword));
    setHasLowerCase(/[a-z]/.test(newPassword));
    setHasNumber(/\d/.test(newPassword));
    setHasValidLength(newPassword.length >= 7 && newPassword.length <= 16);
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
            fontWeight: 600,
            fontSize: "24px",
            color: "#222222",
            marginBottom: "16px",
          }}
        >
          Set New Password
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
          Enter your new password below
        </p>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        {success && (
          <p style={{ color: "green", textAlign: "center" }}>{success}</p>
        )}
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <FormInput
            label="New Password"
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
            hint="Enter new password"
          />
          <FormInput
            label="Confirm New Password"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            hint="Confirm new password"
          />
          <div style={{ marginTop: "10px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "14px",
              }}
            >
              <RequirementBox met={hasValidLength} text="7-16 characters" />
              <RequirementBox met={hasUpperCase} text="1 uppercase" />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <RequirementBox met={hasLowerCase} text="1 lowercase" />
              <RequirementBox met={hasNumber} text="1 number" />
            </div>
          </div>
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

export default SetNewPassword;
