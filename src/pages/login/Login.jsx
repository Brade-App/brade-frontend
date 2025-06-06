import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/FormInput";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/signin_user", {
        email,
        password,
      });

      if (response.data.id) {
        localStorage.setItem("id", response.data.id);
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        navigate("/main-menu");
      } else {
        setError(response.data.error || "Invalid email or password");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError(
        error.response?.data?.error || "An error occurred during sign up"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forget-password");
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
          Welcome back! <br /> Sign in to your account
        </h2>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
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
          <FormInput
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            hint="7-16 characters"
          />
          <div
            style={{
              textAlign: "right",
              marginTop: "5px",
              marginBottom: "20px",
            }}
          >
            <span
              onClick={handleForgotPassword}
              style={{
                color: "#222222",
                cursor: "pointer",
                fontWeight: 500,
                fontSize: "16px",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Forgot password?
            </span>
          </div>
          <div style={{ width: "100%", marginTop: "20px" }}>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                height: "52px",
                backgroundColor: isLoading ? "#cccccc" : "#f564a9",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: isLoading ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </div>
        </form>
        <p style={{ marginTop: "20px", textAlign: "center" }}>
          <span
            style={{
              color: "#5c5c5c",
              fontWeight: 500,
              fontSize: "16px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Don't have an account?{" "}
          </span>
          <span
            onClick={() => navigate("/signup")}
            style={{
              color: "#f564a9",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "16px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Sign up
          </span>
        </p>
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          <button
            onClick={() => {
              setEmail("test@bradehq.com");
              setPassword("Test123");
            }}
            style={{
              backgroundColor: "transparent",
              border: "1px solid #222222",
              color: "#222222",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
            }}
          >
            Use Test Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
